import {NextPage} from "next";
import {useEffect} from "react";

const Search: NextPage = () => {
    useEffect(() => {
        console.log("Home page");
        window.location.href = "/";
    })
    return (
        <>
        </>
    )
}

export default Search;