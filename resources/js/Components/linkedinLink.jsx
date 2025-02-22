export default function LinkedinLink() {
    return (
        <a href={route('socialite.auth', 'linkedin')} className="opacity-10 bg-cyan-700 rounded-3xl lg:max-xl:text-sm  whitespace-nowrap hover:bg-opacity-80  py-2 px-4 text-center  font-semibold w-full max-h-fit text-slate-200">

            <span className="mr-1 float-left"><i className="fa-brands fa-linkedin" style={{ color: "#ffffff" }} /></span>
            <span>Login with Linkedin</span>
        </a>
    )
}