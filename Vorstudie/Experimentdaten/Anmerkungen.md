In CSV-Dateien wird bei der Interaktion mit den Interfaces gespeichert:
- Tabwechsel: Wann wird welcher Tab geöffnet und verlassen, wie lange wurde dort verweilt
- Für Tab1: Was in welche Lücke eingetragen wurde, wann und wann davor in den Tab1 gewechselt wurde -> sollte der Eintrag
  in die Lücke geändert werden, wird sowohl der erste Eintrag mit allen Daten, wie auch der neue Eintrag chronologisch zu allen
  Einträgen gespeichert
- Für Tab2: Wechsel der Tabs, wann erfolgt die Meldung zur Aufgabe, wann wurde Aufgabe gestartet und abgeschlossen -> chronologisch
- Für Tab3: Es wird gespeichert welche Aufgabe ab wann angezeigt wird, wann sie beantwortet wurde, wann davor in den Tab
  gewechselt wurde, wie viel Zeit zwischen Angezeigt und Beantwortung vergangen ist und wie viele Fehler bei Beantwortung
- Gesamtzeit, Gesamtfehler

-> bei Tab3 werden die Zeiten des vorhergehenden Tabwechsels noch falsch hinterlegt, allerdings nicht ganz so schlimm da auch alle Tabwechsel oben angezeigt werden -> im dev branch bereits Code gefixed
