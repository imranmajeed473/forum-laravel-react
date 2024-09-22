import Button from "../Components/button"
import Modal from "../Components/modal"
import Card from "../Components/card"
import CloseButton from "../Components/closeButton"
import { useForm, router, usePage } from "@inertiajs/react"
import { useEffect } from "react"
import ValidationError from "../Components/validationError"
export default function UserSettingsModal({ isVisible, componentRef, close }) {
    const { flash, auth } = usePage().props
    const { data, setData, post, processing, progress, errors, clearErrors, reset } = useForm({
        user_img: "",
        banner_img: "",
        _method: 'put',
    })
    function clearForm() {
        clearErrors()
        reset()
        // document.getElementById("settings_form").reset();
    }
    useEffect(() => {
        clearForm()
    }, [isVisible]);
    function submit(e) {
        e.preventDefault()
        post(route('user.update', auth.user), {
            preserveScroll: true,
            onSuccess: () => { close() }
        })
    }
    return (
        <>
            {isVisible &&
                <div ref={componentRef}>
                    <Modal> <Card name="User settings" shadow='' ButtonComponent={<CloseButton handleOnClick={() => close()} />}>
                        <div className='bg-slate-100 rounded-b-lg h-full shadow-inherit'>



                            <form onSubmit={submit} id="settings_form" >
                                <div className="grid grid-cols-1 gap-3 p-6">
                                    <label className="text-slate-600 text-md font-semibold" htmlFor="user_img">
                                        Upload user image <i className="fa-solid fa-image-portrait" />
                                    </label>
                                    <input onChange={e => setData('user_img', e.target.files[0])} className="rounded-lg cursor-pointer bg-slate-200 text-slate-600 text-md border-slate-700 border
                            file:bg-blue-300 file:border-0 file:text-slate-100 file:h-full file:hover:opacity-50" type="file" id="user_img" />
                                    <ValidationError errors={errors.user_img} />
                                    {data.user_img != "" &&
                                        <img className="w-28 h-28 rounded-full border border-black" src={URL.createObjectURL(data.user_img)} />
                                    }



                                    <label className="text-slate-600 text-md font-semibold" htmlFor="banner_img">Upload banner image <i className="fa-solid fa-image" /></label>
                                    <input onChange={e => setData('banner_img', e.target.files[0])} className="rounded-lg cursor-pointer bg-slate-200 text-slate-600 text-md border-slate-700 border
                            file:bg-blue-300 file:border-0 file:text-slate-100 file:h-full file:hover:opacity-50" type="file" id="banner_img" />
                                    <ValidationError errors={errors.banner_img} />
                                    {data.banner_img != "" &&
                                        <img className="w-full h-28 rounded-lg border border-black" src={URL.createObjectURL(data.banner_img)} />
                                    }
                                    {progress && (
                                        <progress className="rounded-lg text-blue-300" value={progress.percentage} max="100">
                                            {progress.percentage}%
                                        </progress>
                                    )}

                                    <Button disabled={processing} width={"w-full"}>Save</Button>
                                    {flash.message && (
                                        <h1 className="text-slate-600 font-semibold text-md">
                                            {flash.message}
                                        </h1>

                                    )}
                                </div>
                            </form>
                        </div>



                    </Card> </Modal>

                </div>
            }
        </>
    )
}