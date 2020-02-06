# Text Summarization 정리 

## Comprehensive Guide to Text Summarization using Deep Learning in Python
Ref : https://www.analyticsvidhya.com/blog/2019/06/comprehensive-guide-text-summarization-using-deep-learning-python/

Text summarizatin 에는 두가지 방식이 있다.
- Extractive summarization
- Abstractive Summarization

![.](https://s3-ap-south-1.amazonaws.com/av-blog-media/wp-content/uploads/2019/05/13.jpg)

### 1. Extractive Summarization
중요한 sentences 와 phrase를 추출하는 방식

![.](https://s3-ap-south-1.amazonaws.com/av-blog-media/wp-content/uploads/2019/05/extractive1.jpg)

- TextRank algorithm

### 2. Abstract Summarization
Original text 로 부터 새로운 Sentence를 만들어 내는 방식, 새로운 Sentence는 Original Text에 존재 하지 않는 Abstractive Summarization 이다. 

![.](https://s3-ap-south-1.amazonaws.com/av-blog-media/wp-content/uploads/2019/05/abstractive1.jpg)

#### 2.1 Sequence-to-Sequence (Seq2Seq) Modeling
Sequential information을 포함하는 어떤 문제든지 Seq2Seq Model을 만들 수 있다.
(Sentiment classification, Neural Machne Translation, and Named Entity Recognition)

우리의 목적은 긴 연속된 단어들을 input으로 넣고 (Text body), output으로 짧은 summary 를 만들어 내야 된다. 
그래서 이경우 Many-to-Many Seq2Seq 문제이며 아래와 같은 model architecture를 가지게 된다.
(자세한 seq2seq내용 : [Seq2Seq Tutorial](https://www.analyticsvidhya.com/blog/2018/03/essentials-of-deep-learning-sequence-to-sequence-modelling-with-attention-part-i/?utm_source=blog&utm_medium=comprehensive-guide-text-summarization-using-deep-learning-python))

![.](https://s3-ap-south-1.amazonaws.com/av-blog-media/wp-content/uploads/2019/05/final.jpg)

Recurrent Neural Networks (RNNs)으로 
Encoder 와 Decoder components로 Gated Recurrent Neural Network (GRU) 또는 Long Short Term Memory (LSTM)이 사용된다. 
이는 그라디언트 소실(Vanishing Gradient) 문제를 극복하여 긴 의존성(long term)을 포착 할 수 있다.

Encoder-Decoder의 2 phases를 가진다.

##### 2.1.1 Training Phase

###### Encoder
전체 Sequence 중 각 Timestep에 해당하는 하나의 단어를 Long Short Term Memory model (LSTM)에 넣는과정이다.

![.](https://s3-ap-south-1.amazonaws.com/av-blog-media/wp-content/uploads/2019/05/61.jpg)

###### Decoder
LSTM network 은 target sequence word-by-word 를 읽고 같은 sequence offset으로 예측(predict)을 하게 된다.
<strong> Decoder는 이전 단어에서 다음 단어를 예측(Predict)하게 된다. </strong>

![.](https://s3-ap-south-1.amazonaws.com/av-blog-media/wp-content/uploads/2019/05/71.jpg)

<start> 와 <end> 는 special tokens 으로 Decoder에 feeding 전에 추가하게 된다.

##### 2.1.2 Inference Phase



