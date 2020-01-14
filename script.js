/* global alert, chrome, confirm, XMLHttpRequest */

const getInstitutions = () => {
  const table = document.querySelector('table')
  const rows = [].slice.apply(table.querySelectorAll('tbody > tr'))

  const institutions = {}
  rows.forEach((row) => {
    const cell = row.querySelector('td:nth-child(2)')
    if (cell !== null) {
      const match = new RegExp('^([a-z0-9]{6}) - (.+)', 'i').exec(cell.innerText)
      if (match !== null) {
        const id = match[1]
        const name = match[2]
        const group = row.querySelector('td:nth-child(3)').innerText
        const type = row.querySelector('td:nth-child(4)').innerText
        const numberOfMembers = parseInt(row.querySelector('td:nth-child(5)').innerText)

        if (id in institutions) {
          if (!/\(\d+\)/.test(institutions[id].group)) {
            institutions[id].group += ` (${institutions[id].number_of_members})`
          }
          institutions[id].group += `; ${group} (${numberOfMembers})`
          institutions[id].type += `; ${type}`
          institutions[id].number_of_members += numberOfMembers

          console.log(id, institutions[id])
          alert(id)
        } else {
          institutions[id] = {
            id: id,
            name: name,
            group: group,
            type: type,
            number_of_members: numberOfMembers
          }
        }
      }
    }
  })

  return institutions
}

let apiUrl = null
let apiToken = null

chrome.storage.sync.get({
  apiUrl: '',
  apiToken: ''
}, function (items) {
  apiUrl = items.apiUrl
  apiToken = items.apiToken
})

const button = document.querySelector('#extraKnap1 > button')
if (button !== null) {
  const exportButton = button.cloneNode(true)
  exportButton.type = 'button'
  exportButton.innerText = 'Export institutions to eReolen Go!'
  exportButton.classList.add('export-institutions')
  exportButton.addEventListener('click', event => {
    if (!(apiUrl && apiToken)) {
      alert('Missing extension settings!')
      return
    }
    const institutions = getInstitutions()

    if (Object.keys(institutions).length === 0) {
      alert('No institutions found!')
      return
    }

    if (confirm(`Export ${Object.keys(institutions).length} institutions to ${apiUrl}?`)) {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', apiUrl)
      xhr.setRequestHeader('x-authorization', `token ${apiToken}`)
      xhr.setRequestHeader('content-type', 'application/vnd.api+json')
      xhr.send(JSON.stringify({ data: institutions }))

      xhr.onreadystatechange = function (event) {
        if (this.readyState === 4) {
          if (this.status === 204) {
            alert(`${Object.keys(institutions).length} institutions succesfully exported to ${apiUrl}`)
          } else {
            alert(`Error exporting ${Object.keys(institutions).length} institutions to ${apiUrl}:\n${xhr.status} ${xhr.response}`)
            console.log(xhr)
          }
        }
      }
    }
  })
  button.parentNode.appendChild(exportButton)
}
