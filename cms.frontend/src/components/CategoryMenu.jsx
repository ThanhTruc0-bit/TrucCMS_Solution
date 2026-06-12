export default function CategoryMenu() {
    const list = ["ALL", "RINGS", "NECKLACES", "EARRINGS", "BRACELETS"];

    return (
        <div style={styles.wrap}>
            {list.map((item, i) => (
                <button
                    key={i}
                    style={i === 0 ? styles.active : styles.btn}
                >
                    {item}
                </button>
            ))}
        </div>
    );
}

const styles = {
    wrap: {
        display: "flex",
        justifyContent: "center",
        gap: 15,
        marginTop: 30
    },

    btn: {
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: "#666",
        fontSize: 14
    },

    active: {
        background: "#111",
        color: "#fff",
        padding: "6px 14px",
        borderRadius: 20
    }
};