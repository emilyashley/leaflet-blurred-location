describe("Basic testing", function() {
  "use strict";

  var fixture = loadFixtures('index.html');
  var blurredLocation = new BlurredLocation();

  it("Checks if getLat returns the correct latitude with correct precision", function () {
    blurredLocation.setZoom(13);
    expect(blurredLocation.getLat()).toBe(41.01);
    blurredLocation.setZoom(10);
    expect(blurredLocation.getLat()).toBe(41.0);
  });

  it("Checks if getLon returns the correct longitude with correct precision", function () {
    blurredLocation.setZoom(13);
    expect(blurredLocation.getLon()).toBe(-85.66);
    blurredLocation.setZoom(10);
    expect(blurredLocation.getLon()).toBe(-85.6);
  });

  it("Checks if goTo changes the map location to given parameters", function() {
    expect(blurredLocation.getLat()).toBe(41.0);
    expect(blurredLocation.getLon()).toBe(-85.6);
    blurredLocation.goTo(51.50223, -0.09123213, 13);
    expect(blurredLocation.getLat()).toBe(51.50);
    expect(blurredLocation.getLon()).toBe(-0.09);
  });

  it("Checks if blurredLocation has a property named gridSystem", function() {
    expect(blurredLocation.hasOwnProperty("gridSystem")).toBe(true);
  });

  it("Checks if cellSize changes with change in zoom", function() {

    blurredLocation.setZoom(13);

    expect(blurredLocation.gridSystem.getCellSize().rows).toBe(58.25);
    expect(blurredLocation.gridSystem.getCellSize().cols).toBe(94.63);

    blurredLocation.setZoom(10);

    expect(blurredLocation.gridSystem.getCellSize().rows).toBe(72.8);
    expect(blurredLocation.gridSystem.getCellSize().cols).toBe(118.3);

  });

  it("Checks if getPrecision works and changes on zoom", function() {
    blurredLocation.goTo(blurredLocation.getLat(), blurredLocation.getLon(),13);
    expect(blurredLocation.getPrecision()).toBe(2);
    blurredLocation.goTo(blurredLocation.getLat(), blurredLocation.getLon(),10);
    expect(blurredLocation.getPrecision()).toBe(1);
  });

  it("Checks if getFullLat returns the full latitude of the map", function() {
    blurredLocation.goTo(45.324324234,-53.32423234234,13);
    expect(blurredLocation.getFullLat()).toBe(45.324324234);

    blurredLocation.setZoom(10);
    expect(blurredLocation.getFullLat()).not.toBe(blurredLocation.getLat());

  });

  it("Checks if getFullLon returns the full latitude of the map", function() {
    blurredLocation.goTo(45.324324234,-53.32423234234,13);
    expect(blurredLocation.getFullLon()).toBe(-53.32423234234);

    blurredLocation.setZoom(10);
    expect(blurredLocation.getFullLon()).not.toBe(blurredLocation.getLon());
  });

  it("Checks if setBlurred toggles the grid on and off", function() {
    blurredLocation.setBlurred(true);
    expect(blurredLocation.isBlurred()).toBe(true);
    blurredLocation.setBlurred(false);
    expect(blurredLocation.isBlurred()).toBe(false);
  });
  // it("geocode spec", function() {
  //   var geometry = blurredLocation.geocode("Buenos Aires");
  //   console.log(blurredLocation.getLat());
  //   console.log(map.getCenter().lat);
  //   expect(blurredLocation.getLat()).toBe(-34.6036844);
  //   expect(blurredLocation.getLon()).toBe(-58.3815591);
  // });

});
