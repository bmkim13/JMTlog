#!pip install gensim 

from gensim.summarization.summarizer import summarize

def getSummarize(text, word_count ) :
    summary = "None1"
    summarizes = summarize(text, word_count=word_count).split("\n")
    if not (summarizes is None) and len(summarizes) > 0 :
        if summarizes[0] is None :
             summary = "None"
        else :
            summary = summarizes[0]

    return summary
