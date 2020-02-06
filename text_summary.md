# Text Summarization 정리 

## 1. Comprehensive Guide to Text Summarization using Deep Learning in Python
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
  
- TimeDistribute
![.](https://mblogthumb-phinf.pstatic.net/MjAxOTA3MTlfMTQ0/MDAxNTYzNDk5MDIwNjk0.Ko1jG4ematFNFGaS7dFJqJCKoyIVhLXsSLsUNWzadukg.laQainx0gqsofM7EmEi-A5POshd0OkX4yC4Ay0ZeOkwg.GIF.chunjein/2-1.gif?type=w800)

##### 2.1.2 Inference Phase

![.](https://s3-ap-south-1.amazonaws.com/av-blog-media/wp-content/uploads/2019/05/82.jpg)

###### Inference process
1. Encode the entire input sequence and initialize the decoder with internal states of the encoder
2. Pass <start> token as an input to the decoder
3. Run the decoder for one timestep with the internal states
4. The output will be the probability for the next word. The word with the maximum probability will be selected
5. Pass the sampled word as an input to the decoder in the next timestep and update the internal states with the current time step
6. Repeat steps 3 – 5 until we generate <end> token or hit the maximum length of the target sequence
  
#### 2.2 Limitations of the Encoder – Decoder Architecture

- Encoder는 전체 input sequence를 Fixed length vector로 변환 후에 Decoder는 Output sequence를 예측하게 된다. 이는 Decoder가 전체 input sequence를 보고 예측하기 때문에 짧은 sentences 에서만 잘 동작하게 된다. 
- Long Input Sequence에서의 문제 : Encoder는 Long sequence를 Fixed length vector에 변환해서 넣는 것은 어렵다.

이를 극복하기위해 Attention Mechanism을 쓰게 된다.

#### 2.3 The Intuition behind the Attention Mechanism

기본적인 컨셉 설명
- Source sequence: “Which sport do you like the most?
- Target sequence: “I love cricket”
첫번째 단어인 "I" 의 target sequence 는 "you" 에 연결되어 있고 "love"는 "like"에 연결되어 있다.
한번에 전체 단어를 보는 대신 target sequence의 결과에 영향을 미치는 source sequence의 부분의 중요도를 높일 수 있다. 

##### 2.3.1 Global Attention
Encoder의 모든 Hidden state 들은 Attended context vector를 얻는데 영향을 미친다.

![.](https://s3-ap-south-1.amazonaws.com/av-blog-media/wp-content/uploads/2019/05/121.jpg)

##### 2.3.2 Local Attention
Encoder의 일부 Hidden state들이 Attened context vector를 얻는데 영향을 미친다.

![.](https://s3-ap-south-1.amazonaws.com/av-blog-media/wp-content/uploads/2019/05/131.jpg)

## 실습
Jupyter Notebook으로 






