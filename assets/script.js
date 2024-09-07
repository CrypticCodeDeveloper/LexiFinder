const searchBtn = document.getElementById('search-btn')
const search = document.getElementById('search')
const hamburgerMenu = document.getElementById('hamburger-menu')

const word = document.getElementById('word')
const phonetic = document.getElementById('phonetic')
const audio = document.getElementById('audio')
const message = document.querySelector('.message-wrapper')

const popup = document.querySelector('.popup')
const notFound = document.querySelector('.notFound')
const menu = document.querySelector('.menu')

const loading = document.querySelector('.loading')

// part-of-speech container
const nounContainer = document.querySelector('.noun-container')
const verbContainer = document.querySelector('.verb-container')
const adjectiveContainer = document.querySelector('.adjective-container')
const pronounContainer = document.querySelector('.pronoun-container')
const adverbContainer = document.querySelector('.adverb-container')
const prepositionContainer = document.querySelector('.preposition-container')
const conjuctionContainer = document.querySelector('.conjuction-container')
const interjectionContainer = document.querySelector('.interjection-container')
const articleContainer = document.querySelector('.article-container')
const determinerContainer = document.querySelector('.determiner-container')
const exclamationContainer = document.querySelector('.exclamation-container')


// Declaration of all part of speech
let nouns = []; let pronouns = []; let verbs = []; let adjectives = []; let adverbs = []; let prepositions = []; let conjuctions = []; let interjections = []; let articles = []; let determiners = []; let exclamations = [];

hamburgerMenu.addEventListener("click",()=>{
        menu.classList.toggle('hide')
})


// remove popup
const removePopup = () => {
    setTimeout(() => {
        popup.classList.add('hide')
    }, 5000);
}


searchBtn.addEventListener("click", (e)=>{
    e.preventDefault()
    // Get search from the search input
    const searchParam = search.value.toLowerCase().trim();
    //run the search function
    searchWord(searchParam)
    search.value = ""
})

// audio player click function
document.getElementById('audio-player').addEventListener("click",()=>{
    audio.play()
})

//clear DOM function
const clearDOM = () => {
    // clear all divs
    nounContainer.innerHTML = ""
    verbContainer.innerHTML = ""
    adjectiveContainer.innerHTML = ""
    pronounContainer.innerHTML = ""
    adverbContainer.innerHTML = ""
    prepositionContainer.innerHTML = ""
    conjuctionContainer.innerHTML = ""
    interjectionContainer.innerHTML = ""
    articleContainer.innerHTML = ""
    determinerContainer.innerHTML = ""
    exclamationContainer.innerHTML = ""
    //
    word.innerHTML = ""
    phonetic.innerHTML = ""
    audio.src = ""
    //
    nouns.length = 0
    verbs.length = 0
    adjectives.length = 0
    pronouns.length = 0
    adverbs.length = 0
    prepositions.length = 0
    conjuctions.length = 0
    interjections.length = 0
    articles.length = 0
    determiners.length = 0
    exclamations.length = 0
    message.classList.add('hide')
}

// function to search for word
const searchWord = (searchParam) => {

        // check if offline
    if (!navigator.onLine) {
        document.querySelector('.offline').style.display = 'block'
    } else {
        document.querySelector('.offline').style.display = 'none'
    }

    // If the search parameter is empty
    if(searchParam.trim() == ""){
        //
    } else { // If the search parameter contains a word
        loading.style.display = 'block'
        clearDOM()
        const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${searchParam}`.trim()

        fetch(url).then(
            response => { // if word not found
                if(response.status == 404){
                    popup.classList.remove('hide')
                    removePopup()
                    message.classList.remove('hide')
                    //
                    word.innerHTML = "Word"
                    phonetic.innerHTML = "/Transcription/"
                } else {
                    return response.json()
                }
            }
        ).then( // if the response was sent successfully
            data => {
                loading.style.display = 'none'
                // the whole data gotten from the word searched
                const BulkData = data;

                // Display the word
                word.innerHTML = data[0].word;

                // looking for the object that contains both the audio and phonetics
                const vocalbulary = data[0].phonetics.filter(vocal => {
                    if(data[0].phonetics.length == 1){
                        return vocal
                    } else {
                        return vocal.audio != "" && Object.keys(vocal).includes('text');
                    }
                })

                // audio and trascription insertion
                audio.src = vocalbulary[0].audio;
                phonetic.innerHTML = vocalbulary[0].text == undefined ? '' : vocalbulary[0].text;
                const rawMeanings = [];

                // looping over the data
                for(data of BulkData){
                    const {meanings} = data;

                    rawMeanings.push(meanings)
                }

                // get each meaning of the words from each part of speech
                rawMeanings.forEach( meaning => {
                    const presentMeaning = meaning[0]; // Accessing the meaning object in the array
                    const {partOfSpeech, definitions} = presentMeaning;

                    // loop over definitions to get each definition
                    for(definition of definitions){

                    // sort out the definitions according to part of speech
                        switch (partOfSpeech) {
                            case 'noun':
                                nouns.push(definition)
                                break;
                            case 'verb':
                                verbs.push(definition)
                                break;
                            case 'adjective':
                                adjectives.push(definition)
                                break;
                            case 'pronoun':
                                pronouns.push(definition)
                                break;
                            case 'adverb':
                                adverbs.push(definition)
                                break;
                            case 'preposition':
                                prepositions.push(definition)
                                break;
                            case 'conjuction':
                                conjuctions.push(definition)
                                break;
                            case 'interjection':
                                interjections.push(definition)
                                break;
                            case 'article':
                                articles.push(definition)
                                break;
                            case 'determiner':
                                determiners.push(definition)
                                break;
                            case 'exclamation':
                                exclamations.push(definition)
                                break;
                                default:
                                    break;
                                }
                    }
                } )

                // Creating the dynamic HTML template
                let HTML;
                let synonymLinks;
                let antonymLinks;
                const renderHTML = (partOfSpeech, arr) => {

                    HTML = arr.map(defObject => {
                        const {definition, synonyms, antonyms, example} = defObject // destructuring the definition object

                        // Generate links
                        synonymLinks = synonyms.map(synonym => {
                            return `<a class="searchables" onClick = "searchWord(this.innerHTML)" > ${synonym} </a>`
                        })
                        antonymLinks = antonyms.map(antonym => {
                            return `<a class="searchables" onClick = "searchWord(this.innerHTML)"> ${antonym} </a>`
                        })

                        return `
                            <div class="meaning-container">
                            <p class="meaning">${definition}</p>
                            <p class="synonyms">synonyms: <span>${synonymLinks == "" ? "---" : synonymLinks.join(' , ')}</span> </p>
                            <p class="antonyms">antonyms: <span>${antonymLinks == "" ? "---" : antonymLinks.join(' , ')}</span> </p>
                            <p class="example">example: <span>${example == undefined ? "---" : example}</span> </p>
                        </div>
                        `
                    })
                    // returning the final HTML
                    return `
                    <h2 class="part-of-speech" > ${partOfSpeech} </h2>
                    ${HTML.join("")}
                    `
                }

                // inserting the HTML into the DOM
                // checking if there is at least a meaning
                if(nouns.length > 0){
                    nounContainer.innerHTML = renderHTML('Noun', nouns)
                }
                if(verbs.length > 0){
                    verbContainer.innerHTML = renderHTML('Verb', verbs)
                }
                if(adjectives.length > 0){
                    adjectiveContainer.innerHTML = renderHTML('Adjective', adjectives)
                }
                if(pronouns.length > 0){
                    pronounContainerContainer.innerHTML = renderHTML('Pronoun', pronouns)
                }
                if(adverbs.length > 0){
                    adverbContainer.innerHTML = renderHTML('Adverb', adverbs)
                }
                if(prepositions.length > 0){
                    prepositionContainer.innerHTML = renderHTML('Preposition', prepositions)
                }
                if(conjuctions.length > 0){
                    conjuctionContainer.innerHTML = renderHTML('Conjuction', conjuctions)
                }
                if(interjections.length > 0){
                    interjectionContainer.innerHTML = renderHTML('Interjection', interjections)
                }
                if(articles.length > 0){
                    articleContainer.innerHTML = renderHTML('Article', articles)
                }
                if(determiners.length > 0){
                    determinerContainer.innerHTML = renderHTML('Determiner', determiners)
                }
                if(exclamations.length > 0){
                    exclamationContainer.innerHTML = renderHTML('Exclamation', exclamations)
                }
                //
            }
        ).catch(
            error => {
            }
        )
    }
}
