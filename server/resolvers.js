const db = require('./db');

const Query = {
    company: (root, {id}) => db.companies.get(id),
    job: (root, {id}) => db.jobs.get(id),
    jobs: () => db.jobs.list()
};

// one to many relationship company to jobs

const Company = {
    jobs: (company) => db.jobs.list()
        .filter((job) => job.companyId === company.id)
};

const Job = {
    company: (job) => db.companies.get(job.companyId) 
};

const Mutation = {
    createJob: (root, {input}, {user}) => {
        // check user auth
        if (!user) {
            throw new Error('Unauthorized');
        }
        const id = db.jobs.create({...input, companyId: user.companyId});
        return db.jobs.get(id);
    }
};

// mutation CreateJob() {
//     job: createJob(input) {
//         id
//         title 
//         company {
//             id
//             name
//         }
//     }
// }

module.exports = { Query, Job, Company, Mutation };