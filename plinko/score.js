const output = [];
const predictionPoint = 300;
const k = 5;



function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
    output.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
  const testSize = 50;
  const [testSet, trainingSet] = splitData(minMaxNormalization(output, 3), testSize);
  
  // Old Style Code
  // let numberOfCorrect = 0;
  // for(let i = 0; i < testSet.length; i++){
  //   const bucket = knn(trainingSet, testSet[i][0]);
  //   if(bucket === testSet[i][3])
  //     numberOfCorrect++;    
    
  // }
  // const accuracy = numberOfCorrect / testSize;

  // Using Lodash
  _.range(1, 20).forEach(k => {
    const accuracy = _.chain(testSet)
    .filter(testPoint => knn(trainingSet, _.initial(testPoint), k) === testPoint[3])
    .size()
    .divide(testSize)
    .value();
    console.log('For k ' + k + ' Acuracy is ' + accuracy);
  });  
}

function knn(data, point, k){
  return _.chain(data)
  .map(row => {
    return [
      distance(_.initial(row), point), 
      _.last(row)
    ];
  })
  .sortBy(row => row[0])
  .slice(0, k)
  .countBy(row => row[1])
  .toPairs()
  .sortBy(row => row[1])
  .last()
  .first()
  .parseInt()
  .value();
}

function distance(pointA, pointB){
  return _.chain(pointA)
        .zip(pointB)
        .map(([a, b]) => (a - b) ** 2) // sqr 2
        .sum()
        .value() ** 0.5; // sqrt 2 
}

function splitData(data, testCount){
  const shuffled = _.shuffle(data);
  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);

  return [testSet, trainingSet];
}

function minMaxNormalization(data, featureCount){
  const clonedData = _.cloneDeep(data);
  
  // Normalize each feature
  for(let i = 0; i < featureCount; i++){
    const feature = clonedData.map(row => row[i]);
    
    const min = _.min(feature);
    const max = _.max(feature);

    for(let j = 0; j < clonedData,length; j++){
      clonedData[j][i] = (clonedData[j][i] - min) / (max - min);
    }
  }
  return clonedData;
}

