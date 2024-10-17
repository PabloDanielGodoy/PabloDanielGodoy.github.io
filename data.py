file=open("data.txt","r")
dato=int(file.readline())
file.close()
dato=dato+1
file=open("data.txt","w")
file.write(dato)
file.close()
