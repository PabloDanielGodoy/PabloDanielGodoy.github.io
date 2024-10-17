file=open("data.txt","r")
dato=int(file.readline())
file.close()
print("dato="+str(dato))
dato=dato+1
file=open("data.txt","w")
file.write(dato)
file.close()
