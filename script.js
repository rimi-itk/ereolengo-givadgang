const getInstitutions = () => {
	const table = document.querySelector('table')
	const rows = [].slice.apply(table.querySelectorAll('tbody > tr'))

	const institutions = {}
	rows.forEach((row) => {
		const cell = row.querySelector('td:nth-child(2)')
		if (null !== cell) {
			const match = /^([a-z0-9]{6}) - (.+)/.exec(cell.innerText)
			if (null !== match) {
				const id = match[1]
				const name = match[2]
				const group = row.querySelector('td:nth-child(3)').innerText
				const type = row.querySelector('td:nth-child(4)').innerText
				const numberOfMembers = parseInt(row.querySelector('td:nth-child(5)').innerText)
				institutions[id] = {
					id: id,
					name: name,
					group: group,
					type: type,
					numberOfMembers: numberOfMembers
				}
			}
		}
	})

	return institutions
}

const button = document.querySelector('#extraKnap1 > button')
if (null !== button) {
	const exportButton = button.cloneNode(true)
	exportButton.type = 'button'
	exportButton.innerText = 'Export institutions to eReolen Go!'
  exportButton.classList.add('export-institutions')
	exportButton.addEventListener('click', event => {
		const institutions = getInstitutions()
    const url = 'https://misc.srvitkhulk.itkdev.dk/givadgang/api/update.php'

    if (confirm(`Export ${Object.keys(institutions).length} institutions to ${url}?`)) {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', url)
      xhr.send(JSON.stringify(institutions))

      xhr.onreadystatechange = function(event) {
        if (4 === this.readyState && 201 === this.status) {
          alert(`${Object.keys(institutions).length} institutions succesfully exported to ${url}`)
        }
      }
    }
	})
	button.parentNode.appendChild(exportButton)
}
