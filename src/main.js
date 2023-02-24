import { useAlert } from './utils'
import {
  notes,
  Note,
  UI,
  $notes,
  $compose,
  $add,
  $cancel,
  $new,
  $title,
} from './UI'
import './assets/css/index.css'
import { MESSAGES } from './constants'

const handleChange = ({ target }) => {
  if (!target.value.length) return $add.classList.add('disabled')
  return $add.classList.remove('disabled')
}

// DOM Events
$add.addEventListener('click', ({ target }) => {
  if (target.classList.contains('disabled')) return
  const ui = new UI()

  if (window.noteEditing) {
    const note = new Note({})

    ui.add(note)
    notes[note.id] = note
    ui.reset()
    ui.save()
    return useAlert(MESSAGES.CREATED_NOTE)
  }
  const note = new Note({ id: window.noteEditing })
  ui.changeState(note)
  useAlert(MESSAGES.UPDATED_NOTE)
  ui.save()
})

$cancel.addEventListener('click', () => {
  $compose.classList.remove('visibled')
})

$new.addEventListener('click', () => {
  const ui = new UI()
  $compose.classList.add('visibled')
  window.noteEditing = false
  $add.textContent = 'Agregar'
  ui.reset()
})

$notes.addEventListener('click', ({ target }) => {
  const ui = new UI()
  ui.del(target)
  ui.update(target)
})

$title.addEventListener('keyup', handleChange)
$title.addEventListener('blur', handleChange)
$title.addEventListener('blur', handleChange)

// Render Notes
const ui = new UI()
ui.render()
