import { $, useConfirm } from './utils'
import { MESSAGES, STORAGE_NAME } from './constants'

export const [$notes, $compose, $add, $cancel, $new, $title, $description] = [
  $('.notes-list'),
  $('.notes-compose'),
  $('#add'),
  $('#cancel'),
  $('#new'),
  $('#title'),
  $('#description'),
]

export const notes = JSON.parse(window.localStorage.getItem(STORAGE_NAME)) || {}

export class Note {
  constructor({
    id = Date.now(),
    title = $title.value,
    description = $description.value,
  }) {
    this.id = id
    this.title = title
    this.description = description
    this.date = new Date().toLocaleDateString('es')
  }
}

export class UI {
  render() {
    Object.keys(notes).forEach((note) => this.add(notes[note]))
  }

  add(note) {
    const $el = document.createElement('article')

    $el.className = 'note-item'
    $el.dataset.id = note.id

    $el.innerHTML = `
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

  reset() {
    $title.value = ''
    $description.value = ''
    $add.classList.add('disabled')
  }

  async del(el) {
    if (
      el.classList.contains('remove') &&
      (await useConfirm(MESSAGES.DELETE_CONFIRM)).isConfirmed
    ) {
      const { parentElement: parrent } = el
      const { id } = parrent.dataset
      parrent.remove()
      delete notes[id]
      this.save()
    }
  }

  update(el) {
    if (!el.classList.contains('note-title')) return

    const { parentElement: parrent } = el.parentElement

    $add.textContent = 'Editar'

    window.noteEditing = parrent.dataset.id

    const { title, description } = notes[window.noteEditing]

    $title.value = title
    $description.value = description
    $compose.classList.add('visibled')
    $add.classList.remove('disabled')
  }

  changeState(note) {
    $notes.textContent = ''
    notes[note.id] = note
    this.render()
    $compose.classList.remove('visibled')
  }

  save() {
    window.localStorage.setItem(STORAGE_NAME, JSON.stringify(notes))
  }
}
