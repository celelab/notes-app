// Config Global
const store = JSON.parse(window.localStorage.getItem('store'))
const notes = store !== null ? store : {}
let edit = false
const $ = (selector) => document.querySelector(selector)

const $notes = $('.notes-list')
const $compose = $('.notes-compose')
const $add = $('#add')
const $cancel = $('#cancel')
const $new = $('#new')
const $title = $('#title')
const $description = $('#description')

const handleChange = ({ target }) => {
  if (!target.value.length) return $add.classList.add('disabled')
  else return $add.classList.remove('disabled')
}

const randomString = () => {
  const posibleString =
    'abcdehghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ1234567890'
  let value = 'n'

  for (let i = 0; i < 11; i++) {
    value += posibleString.charAt(
      Math.floor(Math.random() * posibleString.length)
    )
  }

  return value
}

// Notifications Sopport
if ('Notification' in window && Notification.permission !== 'denied') {
  Notification.requestPermission((permission) => {
    if (permission === 'granted') {
      new Notification('FireNotes App', {
        icon: '/logo.png',
        body: 'Esta App se esta ejecutando en segundo plano',
      })
    }
  })
}

const useNotification = (body) => {
  if ('Notification' in window) {
    new Notification('FireNotes App', {
      icon: '/logo.png',
      body,
    })
  } else {
    alert(body)
  }
}

const renderNotes = () => {
  const ui = new UI()

  Object.keys(notes).forEach((note) => {
    ui.addNote(notes[note])
  })
}

class Note {
  constructor({
    id = randomString(),
    title = $title.value,
    description = $description.value,
  }) {
    this.id = id
    this.title = title
    this.description = description
    this.date = new Date().toLocaleDateString('es')
  }
}

class UI {
  addNote(note) {
    const $el = document.createElement('article')

    $el.className = 'note-item'
    $el.dataset.id = note.id

    $el.innerHTML = /* html */ `
    <span class="note-icon icon-hashtag"></span>
      <div class="note-body">
      <a href="#${note.id}" class="note-title">${note.title}</a>
      <p class="note-description">${note.description}</p>
      <time class="note-time"><i class="icon-info"></i>${note.date}</time>
    </div>
    <div class="note-icon icon-trash remove"></div>
    `

    $notes.appendChild($el)
  }

  resetForm() {
    $title.value = ''
    $description.value = ''
    $add.classList.add('disabled')
  }

  removeNote(el) {
    if (!el.classList.contains('remove')) return
    if (!confirm('Desea eliminar esta nota?')) return

    const { parentElement: parrent } = el
    const { id } = parrent.dataset
    parrent.remove()
    delete notes[id]
    this.onNoteStateChanged()
  }

  updateNote(el) {
    if (!el.classList.contains('note-title')) return

    const { parentElement: parrent } = el.parentElement

    $add.textContent = 'Editar'

    const { id } = parrent.dataset
    edit = id

    const { title, description, date } = notes[id]

    $title.value = title
    $description.value = description
    $compose.classList.add('visibled')
    $add.classList.remove('disabled')
  }

  noteChangeState(note) {
    $notes.textContent = ''
    notes[note.id] = note
    renderNotes()
    $compose.classList.remove('visibled')
  }

  onNoteStateChanged() {
    window.localStorage.setItem('store', JSON.stringify(notes))
  }
}

// DOM Events
$add.addEventListener('click', ({ target }) => {
  if (target.classList.contains('disabled')) return
  const ui = new UI()

  if (!edit) {
    const note = new Note({})

    ui.addNote(note)
    notes[note.id] = note
    ui.resetForm()
    useNotification('Has creado una nueva nota.')
  } else {
    const note = new Note({ id: edit })
    ui.noteChangeState(note)
    useNotification('Has actualizado una nota.')
  }

  ui.onNoteStateChanged()
})

$cancel.addEventListener('click', () => {
  $compose.classList.remove('visibled')
})

$new.addEventListener('click', () => {
  const ui = new UI()
  $compose.classList.add('visibled')
  edit = false
  $add.textContent = 'Agregar'
  ui.resetForm()
})

$notes.addEventListener('click', ({ target }) => {
  const ui = new UI()
  ui.removeNote(target)
  ui.updateNote(target)
})

$title.addEventListener('keyup', handleChange)
$title.addEventListener('blur', handleChange)
$title.addEventListener('blur', handleChange)

window.addEventListener('load', renderNotes)

// App (Service Worker)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register(new URL('./sw.js', import.meta.url), { scope: '/' })
    .then(() => {
      console.info('App register in worker!')
    })
}
