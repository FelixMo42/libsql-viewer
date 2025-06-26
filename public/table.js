// Get all a tags and mark them as active if they are the current page
window.addEventListener("load", () => {
    document
        .querySelectorAll('.libsql-viewer-tables a')
        .forEach(link => {
            if (link.href === window.location.href) {
                link.classList.add('active')
            }
        })
})

// Handle right click context menu
window.addEventListener("contextmenu", e => {
    e.preventDefault()

    const menu = document.querySelector('.libsql-viewer-context-menu')
    const target = e.target.closest("[data-actions]")
    if (target) {
        menu.style.left = e.pageX + 'px'
        menu.style.top = e.pageY + 'px'
        menu.classList.remove('hidden')

        const actions = JSON.parse(target.dataset.actions)
        menu.replaceChildren(...actions.map(action => {
            if (action === "-") {
                return document.createElement("hr")
            }

            const el = document.createElement("a")
            el.innerText = action.name
            if (action.href) el.href = action.href
            if (action.onclick) el.setAttribute("onclick", action.onclick)
            return el
        }))
    }
})
window.addEventListener("click", () => {
    const menu = document.querySelector('.libsql-viewer-context-menu')
    menu.classList.add('hidden')
})

// Custom query
window.addEventListener("load", () => {
    const textarea = document.querySelector('.libsql-viewer-query textarea')
    console.log(textarea)
    if (!textarea) return
    textarea.addEventListener('keydown', e => {
        console.log(e)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            
            const url = new URL(window.location)
            url.searchParams.set('q', textarea.value.trim())
            window.location.href = url.href
        }
    })
})