import { jobType } from "./Job"

type propertiesType = {
    workspace?: [
        jobs: jobType[]
    ]
}

class Pessoa {
    public properties: propertiesType = {}

}

export default new Pessoa()