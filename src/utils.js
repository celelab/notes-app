import logo from './assets/notes.webp'
import Swal from 'sweetalert2'

export const $ = (s) => document.querySelector(s)

// Notifications Sopport
const defaultRequestPermission = (permission) => {
  if (permission === 'granted')
    return new Notification('Notes App', {
      icon: logo,
      body: 'Esta App se esta ejecutando en segundo plano',
    })
}

if ('Notification' in window && Notification.permission !== 'denied') {
  Notification.requestPermission(defaultRequestPermission)
}

export const useAlert = ([title, text, icon]) => {
  Swal.fire({ title, html: text, icon, showConfirmButton: false, timer: 1500 })

  if ('Notification' in window) {
    return new Notification('Notes App', { icon: logo, body: text })
  }
}

export const useConfirm = async ([title, text, icon]) => {
  return await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText: 'Si',
    cancelButtonText: 'No, cancel!',
    reverseButtons: true,
  })
}
