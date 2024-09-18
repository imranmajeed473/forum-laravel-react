import Layout from '../Layouts/layout'
import SideBar from '../Components/sidebar'
import Card from '../Components/card'
export default function Rules({ breadcrumbs }) {
    return (
        <Layout breadcrumbs={breadcrumbs}>
            <div className='grid md:grid-cols-4 sm:grid-cols-1' name="content_block">
                <div name="main_block" className='md:col-span-3 sm:col-span-2 mt-5'>

                    <Card name={"Rules"}>
                        <div className='bg-slate-100 p-4 text-slate-600'>
                            Have Fun...
                        </div>
                    </Card>

                </div>
                <SideBar />
            </div>


        </Layout>
    )
}
