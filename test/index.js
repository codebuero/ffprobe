const ffprobeStatic = require('ffprobe-static'),
    expect = require('chai').expect,
    path = require('path'),
    util = require('util'),
    ffprobe = require('..');

function fixture(fileName) {
  return path.join(__dirname, 'fixtures', fileName);
}

describe('ffprobe', function() {
  describe('happy path', () => {
    it('should return stream and format info', async () => {
      const info = await ffprobe(fixture('test.jpg'), { path: ffprobeStatic.path })      
      expect(info.streams).to.be.not.empty
      expect(info.format).to.be.not.empty
      expect(info.streams[0].codec_name).to.equal('mjpeg');
      expect(info.streams[0].width).to.equal(175);
      expect(info.streams[0].height).to.equal(174);
    });
  })

  describe('unhappy path', () => {
    it('should throw an error when resource is not defined', async () => {
      try {
        await ffprobe(fixture('not-here.jpg'), { path: ffprobeStatic.path })
      } catch(err) {
        expect(err.message).to.contain('No such file or directory');
      } 
    });
  });
});
