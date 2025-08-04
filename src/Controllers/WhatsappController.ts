import JobberDAL from "../Repositories/JobberDAL"
import JobDAL from "../Repositories/JobDAL"
import { Assignments } from './AlgorithimController'

class WhatsappController {
    public async createWhatsappMessage(assignment: Assignments) {

        console.log("*Trabalhos Internos* ... -> ...")
        
        const jobs = await Promise.all(
            Object.keys(assignment).map(key => JobDAL.getById(Number(key)))
        );
        
        for (let i = 0; i < Object.entries(assignment).length; i++) {
            const [key, values] = Object.entries(assignment)[i]
            const job: any = jobs[i]
            const allJobbers = []
            
            for (const value of values) {
                const jobber: any = await JobberDAL.getById(Number(value))
                
                allJobbers.push(jobber.name)
                //console.log(`${jobber.name} => ${job.name}`)
            }

            console.log(`*${job.name}:* ${allJobbers.join(', ')}`)
        }

        console.log(`=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-`)
    }
}

export default new WhatsappController()