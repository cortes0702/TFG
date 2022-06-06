document.addEventListener("keyup", e => {

    if (e.target.matches("#seeker")) {

        if (e.key === "Escape") e.target.value = ""

        document.querySelectorAll(".article").forEach(search => {
            search.textContent.toLowerCase().includes(e.target.value.toLowerCase())
                ? search.classList.remove("filter")
                : search.classList.add("filter")
        })

    }

})