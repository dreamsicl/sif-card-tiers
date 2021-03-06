// app.constant('Typeahead', [
//   'Nishikino Maki', 'Koizumi Hanayo', 'Hoshizora Rin',
//   'Minami Kotori', 'Sonoda Umi', 'Kousaka Honoka',
//   'Ayase Eli', 'Toujou Nozomi', 'Yazawa Nico',
//   "Ohara Mari", "Kurosawa Dia", "Matsuura Kanan",
//   "Takami Chika", "Sakurauchi Riko", "Watanabe You",
//   "Kunikida Hanamaru", "Kurosawa Ruby", "Tsushima Yoshiko",
//   "lily white", "Printemps", "BiBi",
//   "AZALEA", "CYaRon!", "Guilty Kiss",
//   "Pure", "Cool", "Smile", "Muse", "Aqours",
//   "Score Up", "Perfect Lock", "Healer",
//   // "First year", "Second year", "Third year"
// ]);

app.constant('InitFilters', {
  server: 'jp',
  attribute: 'all',
  sr: true,
  ssr: true,
  ur: true,
  premium: true,
  event: true,
  promo: true,
  su: true,
  pl: true,
  hl: true,
  muse: true,
  aqours: true,
  sis: false,
  subunit: "all",
  year: "all",
  displayImg: true
})
app.constant('InitSong', {
  notes: 550,
  seconds: 125,
  perfects: .85,
  // stars: 65,
  score: 1000000
})
app.constant('InitSort', {
  type: 'stat.avg',
  desc: true
})
app.run(function($rootScope, /*Typeahead,*/ InitFilters, InitSong, InitSort) {
  // $rootScope.Typeahead = angular.copy(Typeahead);
  $rootScope.InitFilters = angular.copy(InitFilters);
  $rootScope.Sort = angular.copy(InitSort)
  $rootScope.Song = angular.copy(InitSong);
  $rootScope.loading = true

});
