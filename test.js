async function main() {

    function sleep(ms = 1000) {
        return new Promise(resolve => setTimeout(resolve, ms, 'good'))
    }
    
    console.log('start');
    const result = await sleep()
    console.log('end result:', result);
    
    module.exports = {
        sleep
    }

    
}

main()

