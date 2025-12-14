# Background Music

Ten folder zawiera muzykę w tle dla aplikacji.

## Instrukcje:

1. Dodaj plik `jingle-bells.mp3` do tego folderu
2. Możesz też użyć innego formatu (MP3 zalecany)
3. Jeśli zmienisz nazwę pliku, zaktualizuj ścieżkę w `components/BackgroundMusic.tsx`

## Gdzie znaleźć muzykę:

**Darmowa muzyka bez praw autorskich:**
- YouTube Audio Library: https://www.youtube.com/audiolibrary
- Free Music Archive: https://freemusicarchive.org/
- Pixabay Music: https://pixabay.com/music/
- Incompetech (Kevin MacLeod): https://incompetech.com/
- Bensound: https://www.bensound.com/

**Wyszukaj:** "Jingle Bells instrumental royalty free"

## Tymczasowe rozwiązanie:

Możesz też użyć zewnętrznego URL zamiast lokalnego pliku:
```typescript
audioRef.current = new Audio('https://www.example.com/jingle-bells.mp3')
```

## Przykładowe linki do darmowej muzyki świątecznej:

- https://pixabay.com/music/search/jingle%20bells/
- https://freemusicarchive.org/search?quicksearch=jingle+bells

## Uwagi:

- Plik powinien być w formacie MP3
- Zalecany rozmiar: do 5MB
- Muzyka będzie odtwarzana w pętli
- Głośność ustawiona na 30%
- Użytkownik może włączyć/wyłączyć muzykę przyciskiem w prawym dolnym rogu
