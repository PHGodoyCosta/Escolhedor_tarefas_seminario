
export type jobType = {
    name: string,
    properties: {
        t: number,
        d: number
    }
}

class Job {
    public properties?: jobType[]

    
}

export default Job