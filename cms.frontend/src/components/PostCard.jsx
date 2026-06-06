import { Link } from "react-router-dom";

export default function PostCard(props) {

    const BASE_URL = "https://localhost:7194";

    return (
        <div style={{
            border: "1px solid #ccc",
            padding: 10,
            width: 250,
            margin: 10
        }}>
            <img src={BASE_URL + props.image} width="100%" />

            {/* 🔥 click vào tiêu đề */}
            <h3>
                <Link to={`/post/${props.id}`}>
                    {props.title}
                </Link>
            </h3>

            <p>{props.content}</p>
        </div>
    );
}