import useModalVisible from "./Hooks/useModalVisible";
import { useForm } from "@inertiajs/react";
export default function PageInput({ children, pagination }) {
    const [ref, isComponentVisible, setIsComponentVisible] = useModalVisible(false);
    const { data, setData, get, processing, errors, clearErrors, reset } = useForm({
        page: pagination.current_page
    })
    function submit(e) {
        e.preventDefault()
        get(pagination.links[data.page].url, {
            preserveScroll: true,
        })
    }
    return (
        <div ref={ref}>
            <button onClick={() => setIsComponentVisible(!isComponentVisible)}>
                <span className="max-lg:text-xs text-md whitespace-nowrap font-semibold text-slate-200 rounded-full hover:opacity-70 px-3 py-1">
                    {children}
                    <i className="fa fa-caret-down" />
                </span>
            </button>
            {isComponentVisible && (
                <div className="absolute z-10">
                    <div className="w-0 h-0 mx-auto
                                    border-l-[5px] border-l-transparent
                                    border-b-[5px] border-b-white
                                    border-r-[5px] border-r-transparent">
                    </div>
                    <div className="shadow-2xl bg-white rounded-md">
                        <form onSubmit={(e) => submit(e)}>
                            <div className="grid grid-cols-1 p-4 gap-2">
                                <input min={1} max={pagination.last_page} value={data.page} onChange={(e) => setData('page', e.target.value)} className="w-44 rounded-lg text-center" type="number" />
                                <button className="bg-blue-300 rounded-3xl hover:bg-opacity-80  py-2 px-4 text-center w-full font-semibold max-h-fit text-slate-200">Show</button>
                            </div>
                        </form>

                    </div>
                </div>
            )}

        </div>
    )
}