const STATE = {
    brewries: [],
    byCity: []
}


const searchData = document.querySelector("#select-state-form")
const searchInput = document.querySelector("#select-state")
const breweryList = document.querySelector("#breweries-list")
const filterForm = document.querySelector("#filter-by-type-form")
const selectFilter = document.querySelector("#filter-by-type")



const renderFiltered = () => {
    selectFilter.addEventListener('change', function () {
        const filters = selectFilter.value
        clear()
        if (filters === '') {
            fetch(`https://api.openbrewerydb.org/breweries?by_state=${searchInput.value}&per_page=50`)
                .then(response => response.json())
                .then(data => breweryData(data))
            return
        }
        fetch(`https://api.openbrewerydb.org/breweries?by_state=${searchInput.value}&by_type=${filters}&per_page=35`)
            .then(response => response.json())
            .then(data => breweryData(data))
    })
}

const renderBrewery = (states) => {

    //ADDRESS LIST
    const liEL = document.createElement('li')
    liEL.className = 'breweries-list'
    //NAME
    const h2EL = document.createElement('h2')
    h2EL.className = 'brewery-name'
    h2EL.innerText = states.name
    //TYPE
    const typeEL = document.createElement('div')
    typeEL.className = 'type'
    typeEL.innerText = states.brewery_type
    //ADDRESS
    const addressEL = document.createElement('section')
    addressEL.className = 'address'
    const addressH3EL = document.createElement('h3')
    addressH3EL.innerText = 'Address'
    //STREET        
    const streetEL = document.createElement('p')
    streetEL.innerText = states.street
    // CITY + POSTAL CODE
    const cityPostalEL = document.createElement('p')
    const strongEL = document.createElement('strong')
    strongEL.innerText = `${states.city}, ${states.postal_code}`
    //PHONE SECTION
    const contactEL = document.createElement('section')
    contactEL.className = 'phone'
    const phoneH3EL = document.createElement('h3')
    phoneH3EL.innerText = 'Phone'
    //PHONE NUMBER
    const phoneNumber = document.createElement('p')
    phoneNumber.innerText = states.phone

    //TYPE AND WEB PAGE SECTION
    const websiteEL = document.createElement('section')
    websiteEL.className = 'link'

    const linkEL = document.createElement('a')
    linkEL.innerText = 'Visit Website'
    linkEL.setAttribute('href', states.website_url)

    //APPENDS
    websiteEL.append(linkEL)
    contactEL.append(phoneH3EL, phoneNumber)
    cityPostalEL.append(strongEL)
    addressEL.append(addressH3EL, streetEL, cityPostalEL)
    liEL.append(h2EL, typeEL, addressEL, contactEL, websiteEL)
    breweryList.append(liEL)

    filterByCity()
}

const renderCityFilter = (data) => {
    STATE.byCity = data
    clear()
    for (const states of STATE.byCity) { renderBrewery(states) }

}


const breweryData = (data) => {
    const byType = data.filter((x) => x.brewery_type === 'micro' || x.brewery_type === 'regional' || x.brewery_type === 'brewpub')
    STATE.brewries = byType
    for (const states of byType) { renderBrewery(states) }
}

const fetchBreweryData = () => {
    searchData.addEventListener("submit", function (form) {
        form.preventDefault()
        clear()
        fetch(`https://api.openbrewerydb.org/breweries?by_state=${searchInput.value}&per_page=50`)
            .then(response => response.json())
            .then(data => breweryData(data))
    })
}

const clear = () => {
    breweryList.innerHTML = ''
}

renderFiltered()
fetchBreweryData()


// EXTENTION 1
const searchBarInput = document.querySelector("#search-breweries")
const breweryNames = breweryList.getElementsByTagName('li')

const searchBar = () => {
    searchBarInput.addEventListener('input', function () {

        const searched = searchBarInput.value.toUpperCase()
        for (const names of breweryNames) {
            const h2 = names.getElementsByTagName('h2')[0]
            const value = h2.innerText

            if (value.toUpperCase().indexOf(searched) > -1) { names.style.display = '' }
            else { names.style.display = 'none' }
            filterByCity()
        }
    })
}

searchBar()

//EXTENTION 2
const cityForm = document.querySelector('#filter-by-city-form')
const clearButton = document.querySelector('.clear-all-btn')
clearButton.style.cursor = 'pointer'

const filterByCity = () => {
    cityForm.innerHTML = ''
    for (const cities of STATE.brewries) {
        const inputEL = createInput('checkbox', cities.city)
        const labelEL = createLabel(cities.city, cities.city)

        cityForm.append(inputEL, labelEL)

        inputEL.addEventListener('change', function () {
            if (inputEL.checked) {
                STATE.byCity = STATE.brewries.filter((x) => x.city === labelEL.innerText)
                renderCityFilter(STATE.byCity)
            }
        })


        /*clearButton.addEventListener('click', function () {
            const clearCheckBox = cityForm.querySelectorAll('input')
            for (const check of clearCheckBox) {
                if (check.checked) {
                    check.checked = false
                }
            }
        })*/
    }
  }  

const createInput = (type, name) => {
    const input = document.createElement('input')
    input.setAttribute('type', type.toLowerCase())
    input.setAttribute('name', name.toLowerCase())
    return input
}

const createLabel = (input, text) => {
    const label = document.createElement('label')
    label.attributes.for = input.toLowerCase()
    label.innerText = text
    return label
}

