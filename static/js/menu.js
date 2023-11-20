const links = document.getElementsByClassName("navLinks")[0].getElementsByTagName("a")
const mobileMenu = document.getElementById("mobileMenu")
for(let i in links){
    let link = links[i]
    let ele = document.createElement("a")
    ele.innerHTML = link.innerHTML
    ele.setAttribute("href", link.getAttribute("href"))
    mobileMenu.appendChild(ele)
}


function menuToggle(){
    const currentClasses = mobileMenu.className.split(' ')
    indexNone = currentClasses.indexOf("display-none")
    indexFlex = currentClasses.indexOf("display-flex")
    if(indexNone !== -1){
        currentClasses[indexNone] = "display-flex"
    }
    else if(indexFlex !== -1){
        currentClasses[indexFlex] = "display-none"
    }
    mobileMenu.className = currentClasses.join(" ")
}
