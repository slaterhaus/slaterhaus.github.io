import {useRouter} from 'next/router';
import {useGetViewConfig} from "@/routing/routes";
import Home from "@/views/home";
import {Client} from "@/components/frontend";

const WildcardPage = () => {
    const config = useGetViewConfig();
    if (config?.Component) {
        return (
            <Client>
                <config.Component/>
            </Client>
        )
    }
    return <h1>View not found</h1>

};

export default WildcardPage;
