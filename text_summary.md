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

  Ref : [TimeDistribute 설명 블로그](https://m.blog.naver.com/PostView.nhn?blogId=chunjein&logNo=221589624838&proxyReferer=https%3A%2F%2Fwww.google.com%2F)

![.](https://mblogthumb-phinf.pstatic.net/MjAxOTA3MTlfMTQ0/MDAxNTYzNDk5MDIwNjk0.Ko1jG4ematFNFGaS7dFJqJCKoyIVhLXsSLsUNWzadukg.laQainx0gqsofM7EmEi-A5POshd0OkX4yC4Ay0ZeOkwg.GIF.chunjein/2-1.gif?type=w800)

- Non TimeDistribute 

![.](https://mblogthumb-phinf.pstatic.net/MjAxOTA3MTlfMjEz/MDAxNTYzNDk5MzU3MTU3.CvAWXC9qs5JiguevobzkDPmOggpTNGJNhNJvbh7bEy0g.uTUc7Hbx-UIXsP3tRZVMGFDj_7wv4YVwokvwkIwKlgwg.GIF.chunjein/2-2.gif?type=w2)

##### 2.1.2 Inference Phase

![.](https://s3-ap-south-1.amazonaws.com/av-blog-media/wp-content/uploads/2019/05/82.jpg)

##### Inference process
1. 전체 input sequence 를 Encode 하고 Decoder를 Encoder의 internal state를 이용해서 initialize 한다.
2. \<start\> Token 을 Decoder의 input으로 넣는다.
3. 하나의 Timestep을 위한 Decoder를 실행 시킨다.(Encoder의 internal states 사용)
4. 다음 단어를 위한 Probability가 Output으로 나오면, 그중 가장 큰 Probability를 선택한다.
5. Decoder의 다음 Timestep으로 선택된 단어를 넘긴다. 현재 Current Timestep의 internal states를 업데이트 한다.
6. \<end\> token이 나오거나 target sequence의 Maximum length 까지 3~5번과정을 반복한다.
  
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

### 3. How does the Attension Mechanism Work?

1. Source sequence에 대해서 Encoder는 Hidden state(hj) 를 모든 Timestep j 마다 출력합니다.
2. 유사하게 Decoder 도 Hidden state(si)를 모든 Timestep i 마다 출력합니다.
3. Alignment Sore(eij) 는 Target word 와 Source word 의 Align 으로 Score가 계산되어 진다. 
   - Aligment score는 score funtion을 사용해서 hj 와 si로 부터 계산되어 진다. 
> 수식 : $$
eij= score (si, hj )
$$

일부 유명한 Attension Mechanisms

![.](https://s3-ap-south-1.amazonaws.com/av-blog-media/wp-content/uploads/2019/05/14.jpg)

#### 3.1 Attension Mechanism Process

1. aij : Normalize the alignment scores

![.](https://s3-ap-south-1.amazonaws.com/av-blog-media/wp-content/uploads/2019/05/211.jpg)

2. Ci : Attended Context Vector, aij와 hj의 곱의 합

![.](https://s3-ap-south-1.amazonaws.com/av-blog-media/wp-content/uploads/2019/05/16.jpg)

3. Si : Attended Hidden Vector

  Si = concatenate([si; Ci])
  
4. yi dense를 Si 의 Feeding으로 만들어 낸다.

  yi = dense(Si)

#### 3.2 상세한 Flow의 이해 

![.](https://s3-ap-south-1.amazonaws.com/av-blog-media/wp-content/uploads/2019/05/17.jpg)

![.](https://s3-ap-south-1.amazonaws.com/av-blog-media/wp-content/uploads/2019/05/final-1.jpg)

1. Target timestep i=1

- Alignment Score

<center>
 
```python
e11= score(s1, h1)
e12= score(s1, h2)
e13= score(s1, h3)
e14= score(s1, h4)
```

</center>

- Normalizing

```python
a11= exp(e11)/((exp(e11)+exp(e12)+exp(e13)+exp(e14))
a12= exp(e12)/(exp(e11)+exp(e12)+exp(e13)+exp(e14))
a13= exp(e13)/(exp(e11)+exp(e12)+exp(e13)+exp(e14))
a14= exp(e14)/(exp(e11)+exp(e12)+exp(e13)+exp(e14))
```

- Attended Context Vector C1

```python
C1= h1 * a11 + h2 * a12 + h3 * a13 + h4 * a14
```

![.](https://s3-ap-south-1.amazonaws.com/av-blog-media/wp-content/uploads/2019/05/19.jpg)

- Attended Hidden Vector S1

```python
S1= concatenate([s1; C1])
```

- Dense 만들기 

```python
y1= dense(S1)
```

2. Target timestep i=2
Timestep 1 과 유사하게 진행된다.

![.](https://s3-ap-south-1.amazonaws.com/av-blog-media/wp-content/uploads/2019/05/20.jpg)


## 실습
Jupyter Notebook으로 






