import {GraphQLClient, gql} from 'graphql-request'

const endpoint = 'https://api.github.com/graphql'
const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
        authorization: 'Bearer 346016738ed559a2a3811fa4228f16219641d7ea',
    },
})

async function getRepos() {
    const query = gql`
    { 
        repositoryOwner(login:"fortuno01")  {
            repositories(first:10) {
                nodes {
                    name
                }
            }
        }
    }
    `

    const data = await graphQLClient.request(query)
    const repos = data.repositoryOwner.repositories.nodes

    for ( let key in repos) {
        $('.list').append(`<button type="button" class="listItem">${repos[key].name}</button>`)
    }
    console.log(data)

    $(this).off()
}

async function getInfo(e) {
    if (e.target.tagName !== 'BUTTON') return
    const repoName = e.target.innerHTML
    const query = gql`
    { 
        repositoryOwner(login:"fortuno01")  {
            repository(name: "${repoName}") {
                nameWithOwner
                createdAt
                diskUsage
                description
                isPrivate
                databaseId
                id
            }
        }
    }
    `
    const data = await graphQLClient.request(query)
    const fields = data.repositoryOwner.repository

    showPopup()
    // заполняем список данными
    Object.entries(fields).forEach((field) => {
        $('.popup__content').append(`<li><span>${field[0]}:</span> ${field[1]}</li>`)
    })

    console.log(data)
}

function showPopup() {
    $('body').css('overflow','hidden')
    $('.popup').removeClass('isHidden')
}

$('.getBtn').on('click', getRepos)
$('.list').on('click', getInfo)
$('.popup__closeBtn').on('click', () => {
    $('body').css('overflow','visible')
    $('.popup').addClass('isHidden')
    // очищаем контент при закрытии popup
    $('.popup__content').html('')
})

