<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \App\Models\Topic;
use \App\Models\Theme;
use \App\Models\Post;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Contracts\Database\Eloquent\Builder;
use App\Notifications\Subscription;
class PostController extends Controller
{
    public function show(Topic $topic, Theme $theme, Post $post)
    {

        return Inertia::render('post', [
            'breadcrumbs' => [
                0 => ["name" => "Home", "route" => route('home')],
                1 => ["name" => $topic->title, "route" => route('topic', $topic)],
                2 => ["name" => $theme->title, "route" => route('theme', [$topic, $theme])],
                3 => ["name" => $post->title, "route" => route('post', [$topic, $theme, $post])]
            ],


            'post' => $post->load(['user' => fn(Builder $query) => $query->withCount('points')]),
            'theme' => $theme,
            'pagination' => $post->replies()->where('reply_id', null)->with([
                'user' => fn(Builder $query) => $query->withCount('points'),
                'replies.user' => fn(Builder $query) => $query->withCount('points'),
                'replies.replies.user' => fn(Builder $query) => $query->withCount('points'),
                'replies.replies.replies'
            ])->orderBy('replies.created_at')->paginate(10),
            'topics' => Topic::with('themes')->get(),
            'topic' => $topic,


        ]);
    }
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|min:10|max:50',
            'message' => 'required|min:10|max:500',
            'theme_id' => 'exists:themes,id',
        ]);

        $post = Post::create([
            'title' => $request->title,
            'message' => $request->message,
            'user_id' => Auth::user()->id,
            'theme_id' => $request->theme_id,
        ]);
        session()->flash("message", "Post created successfully");
        $followers = Theme::find($request->theme_id)->followers;
        foreach ($followers as $follower) {
            if ($follower->user->id != Auth::user()->id) {
                $follower->user->notify(new Subscription($post));
            }
        }

    }
    public static function newPosts(Request $request)
    {
        return Post::with('user', 'theme')->withCount('replies')->latest()->limit(5)->get();
    }
    public static function popularPosts(Request $request)
    {
        return Post::with('user', 'theme')->withCount('replies')->orderByDesc('replies_count')->limit(5)->get();
    }
    public static function latestPosts()
    {
        return Post::selectRaw('t.*')->fromRaw('(SELECT * FROM posts ORDER BY created_at DESC) t')
            ->groupBy('t.theme_id')->with('user')
            ->get();
    }
}
