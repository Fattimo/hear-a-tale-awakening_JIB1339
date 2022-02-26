import os
from pdb import line_prefix
import sys
import json

charsizes = {'a': 71, 'b': 64, 'c': 83, 'd': 64, 'e': 70, 'f': 118, 'g': 46,
	'h': 66, 'i': 162, 'j': 159, 'k': 75, 'l': 127, 'm': 44, 'n':66, 'o': 67, 'p':64,
	'q': 64, 'r': 105, 's': 78, 't': 111, 'u': 67, 'v': 70, 'w': 43, 'x': 71, 'y': 70, 
	'z': 81, 'A': 51, 'B': 55, 'C':57, 'D': 50, 'E': 64, 'F':68, 'G': 51, 'H': 49,
	'I': 146, 'J': 123, 'K': 60, 'L': 69, 'M': 44, 'N': 50, 'O': 49, 'P': 59, 'Q': 49,
	'R': 56, 'S': 61, 'T': 61, 'U': 51, 'V': 54, 'W': 34, 'X': 57, 'Y': 63, 'Z': 63, ' ': 149,
	',': 169, ':': 169, '“': 98, '-': 91, '!': 165, '’': 165, '”': 95, '\n':1000000, '.': 165,
	';': 165, 'ê': 70, 'è': 70, '—': 37, '?': 84, 'ç': 83, 'é': 70, '1': 62, '8': 62, '4': 62,
	'0': 62, 'ô': 67, 'ï': 159, 'î': 151, '(': 118, ')': 118, 'à': 71, '‘': 165}

missing = set()
#Usage: py splitter.py pagesize linesize
class Config():
	def __init__(self) -> None:
		self.book = []
		self.pages = {}
		self.totalpages = 0

	def addpage(self, globalnum, localnum, chapternum):
		self.pages[globalnum] = {"page":localnum, "chapter":chapternum}

	def addchapter(self, chaptername, chapternum, length):
		self.book.append({"chapter":chapternum, "title":chaptername, "pages":length})

	def settotalpages(self, num):
		self.totalpages = num

	def generate(self):
		config = {"book": self.book, "pages":self.pages, "totalPages": self.totalpages}
		with open("public/book/config.json", 'w') as configf:
			json.dump(config, configf)

class Page_Generator():
	def __init__(self) -> None:
		self.paragraphbreak = "\n"
		self.linebreak = " "
		self.pagedir = "public/book/pages/"
		self.chapternum = 0
		self.cf = Config()
		self.maxlength = 1

	def genpage(self, pagenum, rawtext, onparagraph):
		with open(self.pagedir + str(self.chapternum) + "/" + str(pagenum) + ".txt", 'w', encoding='utf8') as page:#Save a page
			txt = ""
			if not onparagraph:
				txt = "&ni; "
			initsize = len(txt)
			if rawtext[0] == " ":
				txt += rawtext[1:].replace("\n", self.paragraphbreak) #Remove leading space
			else:
				txt += rawtext.replace("\n", self.paragraphbreak) #No leading space
			#Split into lines
			linepos = initsize
			sumline = 0
			while linepos < len(txt):
				if txt[linepos] in charsizes:
					sumline += 1 / charsizes[txt[linepos]]
				else:
					if txt[linepos] not in missing:
						missing.add(txt[linepos])
						print(txt[linepos])
					sumline += 1/34 #Upper bound for now
				if txt[linepos] == "\n":
					sumline = 0
				
				if sumline >= self.maxlength:				
					while txt[linepos] != " " and txt[linepos] != "\n":
						linepos -= 1
				if sumline >= self.maxlength:
					if txt[linepos] == " ":
						txt = txt[:linepos] + self.linebreak + txt[linepos + 1:]
					else:
						txt = txt[:linepos+1]
					sumline = 0
				linepos += 1
			nextonparagraph = True
			if txt[len(txt) - 1] != '\n':
				txt += " &jl;"
				nextonparagraph = False
			page.write(txt)
			return nextonparagraph
	
	#pagesize: Size of page in characters
	def split(self, pagesize):
		#Clean any existing pages
		for f in os.listdir(self.pagedir):
			for f1 in os.listdir(self.pagedir + str(f)):
				os.remove(self.pagedir + str(f) + "/" + str(f1))
			os.rmdir(self.pagedir + f)
		globalpagenum = 1 #Book page number
		for f in range(1, 52):#Generate chapter
			self.chapternum = f
			os.mkdir(self.pagedir + str(self.chapternum))
			pagenum = 1 #Chapter page number
			booktxt = None
			chaptername = None
			with open("rawchapters/Chapter" + str(f), 'r', encoding='utf8') as book:
				chaptername = book.readline().strip()
				booktxt = book.read().replace('\x0c', '\n').replace(u'\xa0', " ")#Read book and remove page breaks
			pos = 0#Character position in text of chapter
			onparagraph = True
			while pos + pagesize < len(booktxt):
				end = pagesize
				tmp = booktxt[pos:pos + end]
				if "\n" in tmp:
					while booktxt[pos + end] != "\n":#Page must start on new paragraph
						end -= 1
				else:
					while booktxt[pos + end] != " ":#Page must start in between words
						end -= 1
				onparagraph = self.genpage(pagenum, booktxt[pos:pos + end + 1], onparagraph)
				self.cf.addpage(str(globalpagenum), pagenum, self.chapternum)
				pagenum += 1
				globalpagenum += 1
				pos = pos + end + 1

			if pos != len(booktxt) - 1:#Save last page
				self.genpage(pagenum, booktxt[pos:pos + end], onparagraph)
				self.cf.addpage(str(globalpagenum), pagenum, self.chapternum)
				globalpagenum += 1
			self.cf.addchapter(chaptername, self.chapternum, pagenum)

		self.cf.settotalpages(globalpagenum - 1)
		self.cf.generate()
				

splitter = Page_Generator()
splitter.split(int(sys.argv[1]))