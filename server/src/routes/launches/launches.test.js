const app = require('../../app')
const request = require('supertest')

describe('Test GET /launches',  ()=>{
    
    test('It should respond with 200 success',async ()=>{
       
        const response = await request(app)
                            .get('/launches')
                            .expect('Content-Type',/json/)
                            .expect(200)
    })

})


describe('Test POST /launches',()=>{

    const completeLaunchData = {
        mission: 'US Enterprise',
        rocket: 'NCC1701-D',
        target: 'Kepler - 186 f',
        launchDate: 'January 4, 2028'
    }

    const launchDataWithoutDate = {
        mission: 'US Enterprise',
        rocket: 'NCC1701-D',
        target: 'Kepler - 186 f'
    }


    const launchDataWithInvalidDate = {
        mission: 'US Enterprise',
        rocket: 'NCC1701-D',
        target: 'Kepler - 186 f',
        launchDate: 'wrongn'
    }
    test('It should respond with 201 created',async ()=>{
        const response = await request(app)
                            .post('/launches')
                            .send(completeLaunchData)
                            .expect('Content-Type',/json/)
                            .expect(201)

    const requestDate = new Date(completeLaunchData.launchDate).valueOf()
    const responseDate = new Date(response.body.launchDate).valueOf()

    //checking both request and response dates are same
    expect(responseDate).toBe(requestDate)
    //checking reponse except date property
    expect(response.body).toMatchObject(launchDataWithoutDate)

    })

    test('It should catch missing required properties',()=>{
        
    })  

    test('It should catch invalid dates',()=>{
        
    })
})