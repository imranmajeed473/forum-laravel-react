<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;
class MessageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Message::where("sender_id", auth()->user()->id)->orWhere("reciever_id", auth()->user()->id)->latest()->get()
            ->groupBy(function (Message $message) {
                if ($message->sender_id == auth()->user()->id) {
                    return $message->sender_id . "*" . $message->reciever_id;
                } else {
                    return $message->reciever_id . "*" . $message->sender_id;
                }
            })->map(function ($message) {
                $first_message = $message->first();
                if ($first_message->sender_id == auth()->user()->id) {
                    $first_message->load('reciever');
                    $first_message['sender'] = $first_message['reciever'];
                    unset($first_message['reciever']);
                    return $first_message;
                } else {
                    return $first_message->load('sender');
                }
            })->sortByDesc('created_at')->values()->paginate(10, pageName: "chat_page");
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($recipient_id)
    {
        return [
            "recipient" => User::find($recipient_id),
            "messages" => Message::where("sender_id", auth()->user()->id)->where("reciever_id", $recipient_id)->
                orWhere(function (Builder $query) use ($recipient_id) {
                    $query->where("sender_id", $recipient_id)
                        ->where("reciever_id", auth()->user()->id);
                })->latest()->with("sender")->cursorPaginate(5, cursorName: "message_page")
        ];

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Message $message)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Message $message)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Message $message)
    {
        //
    }
}
