import useModalVisible from "./Hooks/useModalVisible"
import { ModalContext } from "./Context/modalContext"
import { router } from "@inertiajs/react"
import { useContext } from "react"
export default function CrudMenu({ item, handleEdit, isPost }) {
    const [ref, isComponentVisible, setIsComponentVisible] = useModalVisible(false)
    const { setShowConfirm, confirmAction, confirmMessage } = useContext(ModalContext)

    return (
        <div ref={ref} className=" text-slate-700 relative">
            <button className="mr-1 hover:opacity-70" onClick={() => setIsComponentVisible(!isComponentVisible)}>
                <i className="fa-solid fa-caret-down" />
            </button>
            {isComponentVisible &&

                <div className="absolute max-md:text-2xl max-md:p-4 max-md:-left-6  z-10 bg-blue-200 border-slate-700 border-0.5 left-1/2 rounded-tr-lg p-2  transform -translate-x-1/2 -translate-y-1/2">
                    <ul className="max-md:flex gap-4">
                        <li>
                            <button className="hover:opacity-70" onClick={handleEdit}><i className="fa-solid fa-pen-to-square" /></button>
                        </li>
                        <li>
                            <button onClick={() => {
                                setShowConfirm(true), confirmAction.current = () => router.delete(isPost ? route('post.destroy', item.id) : route('reply.destroy', item.id), {}, { preserveScroll: true }),
                                    confirmMessage.current = "Are you sure you want to delete this " + (isPost ? "post" : "reply") + "?"
                            }} className="hover:opacity-70"><i className="fa-solid fa-trash" /></button>

                        </li>
                    </ul>

                </div>

            }
        </div>

    )
}