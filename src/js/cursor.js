import { gsap } from 'gsap'

const cursor = document.querySelector('#cursor')

// on mouse move, move the cursor element
window.addEventListener('mousemove', e => {
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0 })
})

// set the cursor active style
const setCursorActive = e => {
	e.preventDefault()
	cursor.classList.add('active')
	const message = cursor.getElementsByTagName('span')[0]
	message.innerHTML = e.target.alt || ''
}

// set the cursor inactive style
const setCursorInactive = e => {
	e.preventDefault()
	cursor.classList.remove('active')
}

// add mouse interactions with project images
const stickyElements = document.querySelectorAll('.sticky')
stickyElements.forEach((element => element.onmouseenter = setCursorActive))
stickyElements.forEach((element => element.onmouseout = setCursorInactive))