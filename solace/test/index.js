import {TopicPublisher} from '../pub.js'

describe('', function () {
    this.timeout(0)
    it('connect: pub', () => {
        const topicName = 'marry'
        const pub = new TopicPublisher(console)
        pub.connect()
    })
})