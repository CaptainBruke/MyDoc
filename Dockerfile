FROM mcr.microsoft.com/dotnet/aspnet:3.1
WORKDIR /app
EXPOSE 80
COPY . .
CMD ["dotnet", "MyDoc.dll"]