// Lat/lng for every city currently used by member firms in Sanity.
// Format: `${city},${stateAbbr}` (case-sensitive city, uppercase state).
// If you add a new firm in a new city, add one entry here.
//
// Coordinates are city-center approximations (good enough for a national map).
export const FIRM_CITY_COORDS: Record<string, [number, number]> = {
  'Naples,FL':          [26.142, -81.795],
  'St. Augustine,FL':   [29.895, -81.314],
  'Atlanta,GA':         [33.749, -84.388],
  'LaGrange,GA':        [33.039, -85.031],
  'Lafayette,IN':       [40.417, -86.876],
  'Tewksbury,MA':       [42.612, -71.234],
  'Sterling Heights,MI':[42.580, -83.030],
  'Anoka,MN':           [45.198, -93.387],
  'Brevard,NC':         [35.234, -82.734],
  'Charlotte,NC':       [35.227, -80.843],
  'Greenville,NC':      [35.613, -77.366],
  'High Point,NC':      [35.956, -80.005],
  'Greenville,SC':      [34.852, -82.394],
  'Greer,SC':           [34.939, -82.227],
  'Hartsville,SC':      [34.374, -80.073],
  'Okatie,SC':          [32.366, -80.876],
  'Seneca,SC':          [34.685, -82.953],
  'Austin,TX':          [30.267, -97.743],
  'Beaumont,TX':        [30.080, -94.126],
  'Houston,TX':         [29.760, -95.370],
  'Bellevue,WA':        [47.610, -122.187],
  'Kirkland,WA':        [47.681, -122.209],
};

// us-atlas TopoJSON uses FIPS state codes; we need USPS abbreviations to
// match Sanity's `state` field.
export const FIPS_TO_ABBR: Record<string, string> = {
  '01':'AL','02':'AK','04':'AZ','05':'AR','06':'CA','08':'CO','09':'CT','10':'DE','11':'DC','12':'FL',
  '13':'GA','15':'HI','16':'ID','17':'IL','18':'IN','19':'IA','20':'KS','21':'KY','22':'LA','23':'ME',
  '24':'MD','25':'MA','26':'MI','27':'MN','28':'MS','29':'MO','30':'MT','31':'NE','32':'NV','33':'NH',
  '34':'NJ','35':'NM','36':'NY','37':'NC','38':'ND','39':'OH','40':'OK','41':'OR','42':'PA','44':'RI',
  '45':'SC','46':'SD','47':'TN','48':'TX','49':'UT','50':'VT','51':'VA','53':'WA','54':'WV','55':'WI','56':'WY',
};
