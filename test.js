const hello = async () => {
    console.log('start...');
    debugger;
    const res = await new Promise(resolve => setTimeout(() => resolve('good'), 3000));
    console.log('res->', res);
    console.log('done...');
} 


hello();
