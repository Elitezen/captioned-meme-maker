import { Link } from "react-router-dom";
import './Home.module.scss';

export default function Home() {
    return (
        <>
            <header>
                <h1>Captioned Meme Maker</h1>
                <h2>Make Quick and Simple Memes</h2>
                <Link to="/create">Create</Link>
            </header>
        </>
    )
}