import os
import re

#Find each phrase in phrases in the book and replace spaces with &fr
def findandformatfrench(phrases):
    frenchphrases = []
    #Ignore phrases without spaces
    for phrase in phrases:
        if " " in phrase.strip():
            frenchphrases.append(phrase.strip())
    frenchphrases.sort(key = lambda phrase: len(phrase), reverse=True)

    for i in range(1, 40):
        dir = f"../public/book/pages/{i}/"
        files = os.listdir(dir)
        for file in files:
            text = None
            with open(dir + str(file), 'r', encoding='utf8') as f:
                text = f.read()#Read file
                ltext = text.lower()
                for i in range(len(frenchphrases)):
                    offset = 0
                    positions = [f.start() for f in re.finditer(frenchphrases[i], ltext)]#Get starting positions
                    for pos in positions:
                        #Phrases are all lowercase, so the text must also be lowercase to match them
                        #Get the copy from the original text and mutate that
                        text = (text[:pos + offset] + text[pos+offset:pos+len(frenchphrases[i])+offset].replace(" ", "&fr") + 
                            text[pos+len(frenchphrases[i]) + offset:])
                        ltext = ltext[:pos + offset] + frenchphrases[i].replace(" ", "&fr") + ltext[pos+len(frenchphrases[i]) + offset:]
                        offset += 2#File following previous start is now indices behind where it was

            with open(dir + str(file), 'w', encoding='utf8') as f:
                f.write(text)#Write changes
    
