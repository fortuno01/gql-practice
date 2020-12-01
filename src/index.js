import {GraphQLClient, gql} from 'graphql-request'

const endpoint = 'https://api.github.com/graphql'
const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
        authorization: 'Bearer ',
    },
})
// рендер списка репозиториев
function renderRepos(data) {
    const repos = data.repositoryOwner.repositories.nodes

    for ( let key in repos) {
        $('.list').append(`<button type="button" class="listItem">${repos[key].name}</button>`)
    }
}
// рендер информации по репозиторию
function renderRepoInfo(data) {
    const fields = data.repositoryOwner.repository

    Object.entries(fields).forEach((field) => {
        $('.popup__content').append(`<li><span>${field[0]}:</span> ${field[1]}</li>`)
    })
}

function showPopup() {
    $('body').css('overflow','hidden')
    $('.popup').removeClass('isHidden')
}

async function getRepos() {
    const query = gql`
    query getRepos($login: String!) { 
        repositoryOwner(login: $login)  {
            repositories(first:10) {
                nodes {
                    name
                }
            }
        }
    }
    `
    const variables = {
        login: "fortuno01",
    }

    const data = await graphQLClient.request(query,variables)

    renderRepos(data)

    console.log(data)

    $(this).off()
}

async function getInfo(e) {
    if (e.target.tagName !== 'BUTTON') return
    const repoName = e.target.innerHTML
    const query = gql`
    query getInfo($login: String!,$repoName: String!){ 
        repositoryOwner(login: $login)  {
            repository(name: $repoName) {
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
    const variables = {
        login: "fortuno01",
        repoName: `${repoName}`,
    }

    const data = await graphQLClient.request(query,variables)

    showPopup()
    renderRepoInfo(data)

    console.log(data)
}

$('.getBtn').on('click', getRepos)
$('.list').on('click', getInfo)
$('.popup__closeBtn').on('click', () => {
    $('body').css('overflow','visible')
    $('.popup').addClass('isHidden')
    // очищаем контент при закрытии popup
    $('.popup__content').html('')
})

