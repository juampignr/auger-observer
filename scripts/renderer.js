const runnersNames = document.querySelector("#runnersNames")
const runnersNamesRegex = /^[a-z\u00C0-\u024F\u1E00-\u1EFF ,]{4,}$/i

const logDate = document.querySelector("#logDate")

const hardwareIssues = document.querySelector("#hardwareIssues")
const softwareIssues = document.querySelector("#softwareIssues")
const dataIssues = document.querySelector("#dataIssues")
const weatherIssues = document.querySelector("#weatherIssues")
const issuesRegex = /^[^<>&\/\\{}[\]=+*%$^|?!~`]{4,}$/i;

const detailedComments = document.querySelector("#detailedComments")

const lomaAmarilla = document.querySelectorAll(".lomaAmarilla")
const coihueco = document.querySelectorAll(".coihueco")

const saveButton = document.querySelector("#save")

const dataMap = new Map()

window.addEventListener('DOMContentLoaded', () => {

    const required = {"runnersNames":false,"stations":false}
    const textAreas = [hardwareIssues,softwareIssues,dataIssues,weatherIssues]
    const currentDate = new Date()

    const day = String(currentDate.getDate()).padStart(2, '0')
    const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    const year = currentDate.getFullYear()

    logDate.setAttribute("value",`${year}-${month}-${day}`)

    dataMap.set("numericDate",`${year}-${month}-${day}`)

    saveButton.addEventListener("click",event=>{

        let runDate = Date(logDate.value).toString().split(" ")
        runDate = `${runDate[0]} ${runDate[1]} ${runDate[2]} ${runDate[3]}`

        dataMap.set("logDate",runDate)

        for (const element of lomaAmarilla) {
            
            if(element.value){

                required["stations"] = true 

            }

            dataMap.set(element.getAttribute("id"),element.value ? element.value : false)
        }

        for (const element of coihueco) {
            
            if(element.value){

                required["stations"] = true 

            }
            
            dataMap.set(element.getAttribute("id"),element.value ? element.value : false)
        }
       
        for (const element of textAreas) {
            
            if(issuesRegex.test(element.value)){

                dataMap.set(element.getAttribute("id"),element.value)

            }else{

                dataMap.set(element.getAttribute("id"),false)
            }
        }

        if(runnersNamesRegex.test(runnersNames.value)){

            dataMap.set("runnersNames",runnersNames.value)
            required["runnersNames"] = true 

        }

        if(issuesRegex.test(detailedComments.value)){

            dataMap.set("detailedComments",detailedComments.value)

        }
        
        const isNotValid = Array.from(Object.values(required)).some(item => item === false)
        
        if(isNotValid){

            runnersNames.classList.add("is-warning")

            for (const element of lomaAmarilla) {

                element.classList.add("is-warning")
            }

            for (const element of coihueco) {

                element.classList.add("is-warning")
            }

            save.classList.toggle("is-warning")
            save.innerHTML = "Error"

            setTimeout(()=>{

                save.classList.toggle("is-warning")
                save.innerHTML = "Save"
            },10000)
        }else{
	
            save.classList.toggle("is-success")
            save.innerHTML = "Saved"

            setTimeout(()=>{

                save.classList.toggle("is-success")
                save.innerHTML = "Save"
            },10000)
	}


        window.ipc.send(dataMap)
    })
})
