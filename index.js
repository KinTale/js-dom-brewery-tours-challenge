const STATE = {
    brewries: [],
    searchedStates: "",

    filterCollection: [],
    cities: []
}

//STANDARD CRITERIA
const searchData = document.querySelector("#select-state-form")
const searchInput = document.querySelector("#select-state")
const breweryList = document.querySelector("#breweries-list")
const filterForm = document.querySelector("#filter-by-type-form")
const selectFilter = document.querySelector("#filter-by-type")
const BREW_TYPE = ['micro', 'regional', 'brewpub']

//4. Event listeners for selected brewery types to render on main page
const listenToTypes = () => {
    selectFilter.addEventListener('change', function () {

        if (STATE.searchedStates === "") { return }
        const filters = selectFilter.value
        STATE.filterCollection = []
        clear()
        if (filters === '') {
            fetch(`https://api.openbrewerydb.org/breweries?by_state=${searchInput.value}&per_page=50`)
                .then(response => response.json())
                .then(data => breweryData(data))
            return // renders page to the initial search state if slected "select a type ..."
        }
        fetch(`https://api.openbrewerydb.org/breweries?by_state=${searchInput.value}&by_type=${filters}&per_page=35`)
            .then(response => response.json())
            .then(data => breweryData(data))
    })
}

//3. Renders breweries details on main page
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
    let phoneNum = states.phone
    if (phoneNum === null) {
        phoneNum = 'N/A'
    }
    const phoneNumber = document.createElement('p')
    phoneNumber.innerText = phoneNum
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
}

// 2. 
// a. Filter the passed data of the three types = 'micro', 'regional' 'brewpub'
// b. Update STATE
// c. Each itteration of the STATE pass to renderBrewery() function
const breweryData = (data) => {
    const byType = data.filter((x) => BREW_TYPE.includes(x.brewery_type))
    STATE.brewries = byType
    filterByCity()
    for (const states of byType) { renderBrewery(states) }
}
// 1. Fetch data from server then pass to breweryData(data) 
const fetchBreweryData = () => {
    searchData.addEventListener("submit", function (form) {
        form.preventDefault()
        STATE.searchedStates = searchInput.value
        clear()
        fetch(`https://api.openbrewerydb.org/breweries?by_state=${searchInput.value}&per_page=50`)
            .then(response => response.json())
            .then(data => breweryData(data))
    })
}
const clear = () => {
    breweryList.innerHTML = ''
}

//CALLING
listenToTypes()
fetchBreweryData()


// EXTENTION 1 
const searchBarInput = document.querySelector("#search-breweries")
const breweryNames = breweryList.getElementsByTagName('li')

// 1. Collects all input data in uppercase into searched variable
// 2. For loop on the current list of <li> loaded currently on the page
// 3. Of each iteration of <li> tags, get its h2 tag and its innerText
// 4. If statement, h2 innerText searching with .indexOf() and rendering results in main page

const searchBar = () => {
    searchBarInput.addEventListener('input', function () {
        const searched = searchBarInput.value.toUpperCase()
        for (const names of breweryNames) {
            const h2 = names.getElementsByTagName('h2')[0]
            const value = h2.innerText
            if (value.toUpperCase().indexOf(searched) > -1) { names.style.display = '' }
            else { names.style.display = 'none' }
        }
    })
}

searchBar()

//EXTENTION 2
const cityForm = document.querySelector('#filter-by-city-form')
const inputEL = cityForm.getElementsByTagName('input')
const labelEL = cityForm.getElementsByTagName('label')
const clearButton = document.querySelector('.clear-all-btn')
clearButton.style.cursor = 'pointer'

//1
// a. Function created specifically to filterCollection data from checked box
// b. Data is pushed to the filterCollection State as multiple arrays everytime a check box is checked
// c. STATE.filterCollection is then merged into one array and updated on STATE.cities 
// d. STATE.cities is then rendered showing multiple checked city filters in main page at the same time

const renderCityFilter = (data) => {
    STATE.filterCollection.push(data)
    const mergedArray = [].concat.apply([], STATE.filterCollection)
    STATE.cities = mergedArray
    clear()
    for (const states of STATE.cities) { renderBrewery(states) }
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

//2
// a. Creates event listener check boxes of city filters of all the city in current STATE.brewries
// b. When box is checked, it returns all the cities in filteredCity that was matched in current brewries state with the labels innerText
// c. Those cities are then passed into renderCityFilter()
// d. Creates event listner to clear the filters. It sets the filterCollection and by City state back to default,
// unchecks all the checked boxes and renders the main page again from the breweris state.

const filterByCity = () => {
    cityForm.innerHTML = ''
    for (const cities of STATE.brewries) {
        const inputEL = createInput('checkbox', cities.city)
        const labelEL = createLabel(cities.city, cities.city)
        cityForm.append(inputEL, labelEL)

        inputEL.addEventListener('change', function () {
            if (inputEL.checked) {
                const filteredCity = STATE.brewries.filter((x) => x.city === labelEL.innerText)
                renderCityFilter(filteredCity)
            }
    
        })
        clearButton.addEventListener('click', function () {
            STATE.filterCollection = []
            STATE.cities = []
            clear()
            inputEL.checked = false
            STATE.brewries.forEach(brewries => renderBrewery(brewries))
        })
    }
}

