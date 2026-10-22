# nutzung

Ein Mod für Claude Code, der über dem Eingabefeld deine Claude-Nutzung anzeigt:
das 5-Stunden-Fenster und das Wochenlimit, jeweils als Balken mit Prozentwert
und der Uhrzeit, zu der das Limit zurückgesetzt wird. Ab 80 % wird der Wert rot.

```
5 Std.: ███░░░░░░░ 27% (Reset 16:30)   ·   Woche: ████░░░░░░ 41% (Reset Mo 09:00)
```

Die Zahlen werden nach jeder Antwort von Claude aktualisiert. Die Anzeige
funktioniert nur mit einem Claude-Abo (Pro oder Max); ohne Abo bleibt sie leer.
Eine Einrichtung ist nicht nötig.

## Installation

Im Terminal in einer Claude-Code-Sitzung:

```
/plugin install nutzung --marketplace holgerfpunkt/claude-nutzung
```

Aus einer Shell:

```
claude plugin install nutzung --marketplace holgerfpunkt/claude-nutzung
```

In der Claude-Desktop-App: auf + neben dem Eingabefeld klicken, dann Plugins,
Add marketplace mit `holgerfpunkt/claude-nutzung`, dann Add plugin.

## Lizenz

MIT
