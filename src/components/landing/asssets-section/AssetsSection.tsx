import AssetsHeader from "./AssetsHeader";
import AssetsCard from "./AssetsCard";



export default function AssetsSection() {

    return(

        <section className="bg-background flex flex-col items-center justify-center">

            <AssetsHeader />

            <AssetsCard />           

        </section>

    )

}