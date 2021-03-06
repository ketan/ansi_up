var ansi_up = require('../ansi_up');

var should = require('should');

describe('ansi_up', function() {

	describe('escape_for_html', function() {

		describe('ampersands', function() {

			it('should escape a single ampersand', function() {
				var start = "&";
				var expected = "&amp;";

				var l = ansi_up.escape_for_html(start);
				l.should.eql(expected);
			});

			it('should escape some text with ampersands', function() {
				var start = "abcd&efgh";
				var expected = "abcd&amp;efgh";

				var l = ansi_up.escape_for_html(start);
				l.should.eql(expected);
			});

			it('should escape multiple ampersands', function() {
				var start = " & & ";
				var expected = " &amp; &amp; ";

				var l = ansi_up.escape_for_html(start);
				l.should.eql(expected);
			});

			it('should escape an already escaped ampersand', function() {
				var start = " &amp; ";
				var expected = " &amp;amp; ";

				var l = ansi_up.escape_for_html(start);
				l.should.eql(expected);
			});
		});

		describe('less-than', function() {

			it('should escape a single less-than', function() {
				var start = "<";
				var expected = "&lt;";

				var l = ansi_up.escape_for_html(start);
				l.should.eql(expected);
			});

			it('should escape some text with less-thans', function() {
				var start = "abcd<efgh";
				var expected = "abcd&lt;efgh";

				var l = ansi_up.escape_for_html(start);
				l.should.eql(expected);
			});

			it('should escape multiple less-thans', function() {
				var start = " < < ";
				var expected = " &lt; &lt; ";

				var l = ansi_up.escape_for_html(start);
				l.should.eql(expected);
			});

		});

		describe('greater-than', function() {

			it('should escape a single greater-than', function() {
				var start = ">";
				var expected = "&gt;";

				var l = ansi_up.escape_for_html(start);
				l.should.eql(expected);
			});

			it('should escape some text with greater-thans', function() {
				var start = "abcd>efgh";
				var expected = "abcd&gt;efgh";

				var l = ansi_up.escape_for_html(start);
				l.should.eql(expected);
			});

			it('should escape multiple greater-thans', function() {
				var start = " > > ";
				var expected = " &gt; &gt; ";

				var l = ansi_up.escape_for_html(start);
				l.should.eql(expected);
			});

		});

		describe('mixed characters', function() {

			it('should escape a mix of characters that require escaping', function() {
				var start = "<&>/\\'\"";
				var expected = "&lt;&amp;&gt;/\\'\"";

				var l = ansi_up.escape_for_html(start);
				l.should.eql(expected);
			});

		});

	});

	describe('linkify', function() {

			it('should linkify a url', function() {
				var start = "http://link.to/me";
				var expected = "<a href=\"http://link.to/me\">http://link.to/me</a>";

				var l = ansi_up.linkify(start);
				l.should.eql(expected);
			});

	});

	describe('ansi to html', function() {

    describe('default colors', function() {
      it('should transform a foreground to html', function() {
        var attr = 0;
        var fg = 32;
        var start = "\033[" + fg + "m " + fg + " \033[0m";

        var expected = "<span style=\"color:rgb(0, 187, 0)\"> " + fg + " </span>";

        var l = ansi_up.ansi_to_html(start);
        l.should.eql(expected);
      });


      it('should transform a attr;foreground to html', function() {
        var attr = 0;
        var fg = 32;
        var start = "\033[" + attr + ";" + fg + "m " + fg + "  \033[0m";

        var expected = "<span style=\"color:rgb(0, 187, 0)\"> " + fg + "  </span>";

        var l = ansi_up.ansi_to_html(start);
        l.should.eql(expected);
      });

      it('should transform an empty code to a normal/reset html', function() {
        var attr = 0;
        var fg = 32;
        var start = "\033[" + attr + ";" + fg + "m " + fg + "  \033[m x";

        var expected = "<span style=\"color:rgb(0, 187, 0)\"> " + fg + "  </span> x";

        var l = ansi_up.ansi_to_html(start);
        l.should.eql(expected);
      });

      it('should transform a bold attr;foreground to html', function() {
        var attr = 1;
        var fg = 32;
        var start = "\033[" + attr + ";" + fg + "m " + attr + ";" + fg + " \033[0m";

        var expected = "<span style=\"color:rgb(0, 255, 0)\"> " + attr + ";" + fg + " </span>";

        var l = ansi_up.ansi_to_html(start);
        l.should.eql(expected);
      });

      it('should transform a bold-foreground to html', function() {
        var fg = 92;
        var start = "\033[" + fg + "m " + fg + " \033[0m";

        var expected = "<span style=\"color:rgb(0, 255, 0)\"> " + fg + " </span>";

        var l = ansi_up.ansi_to_html(start);
        l.should.eql(expected);
      });

      it('should transform a bold attr;background;foreground to html', function() {
        var attr = 1;
        var fg = 33;
        var bg = 42;
        var start = "\033[" + attr + ";" + bg + ";" + fg + "m " + attr + ";" + bg + ";" + fg + " \033[0m";

        var expected = "<span style=\"color:rgb(255, 255, 85);background-color:rgb(0, 187, 0)\"> " + attr + ";" + bg + ";" + fg + " </span>";

        var l = ansi_up.ansi_to_html(start);
        l.should.eql(expected);
      });

      it('should transform a bold-background;foreground to html', function() {
        var fg = 33;
        var bg = 102;
        var start = "\033[" + bg + ";" + fg + "m " + bg + ";" + fg + " \033[0m";

        var expected = "<span style=\"color:rgb(187, 187, 0);background-color:rgb(0, 255, 0)\"> " + bg + ";" + fg + " </span>";

        var l = ansi_up.ansi_to_html(start);
        l.should.eql(expected);
      });


      it('should transform a complex multi-line sequence to html', function() {
        var attr = 1;
        var fg = 32;
        var bg = 42;
        var start = "\n \033[" + fg + "m " + fg + "  \033[0m \n  \033[" + bg + "m " + bg + "  \033[0m \n zimpper ";

        var expected = "\n <span style=\"color:rgb(0, 187, 0)\"> " + fg + "  </span> \n  <span style=\"background-color:rgb(0, 187, 0)\"> " + bg + "  </span> \n zimpper ";

        var l = ansi_up.ansi_to_html(start);
        l.should.eql(expected);
      });
    });

    describe('themed colors', function() {
      it('should transform a foreground to html', function() {
        var attr = 0;
        var fg = 32;
        var start = "\033[" + fg + "m " + fg + " \033[0m";

        var expected = "<span class=\"ansi-green-fg\"> " + fg + " </span>";

        var l = ansi_up.ansi_to_html(start, {use_classes: true});
        l.should.eql(expected);
      });


      it('should transform a attr;foreground to html', function() {
        var attr = 0;
        var fg = 32;
        var start = "\033[" + attr + ";" + fg + "m " + fg + "  \033[0m";

        var expected = "<span class=\"ansi-green-fg\"> " + fg + "  </span>";

        var l = ansi_up.ansi_to_html(start, {use_classes: true});
        l.should.eql(expected);
      });

      it('should transform a bold attr;foreground to html', function() {
        var attr = 1;
        var fg = 32;
        var start = "\033[" + attr + ";" + fg + "m " + attr + ";" + fg + " \033[0m";

        var expected = "<span class=\"ansi-bright-green-fg\"> " + attr + ";" + fg + " </span>";

        var l = ansi_up.ansi_to_html(start, {use_classes: true});
        l.should.eql(expected);
      });

      it('should transform a bold attr;background;foreground to html', function() {
        var attr = 1;
        var fg = 33;
        var bg = 42;
        var start = "\033[" + attr + ";" + bg + ";" + fg + "m " + attr + ";" + bg + ";" + fg + " \033[0m";

        var expected = "<span class=\"ansi-bright-yellow-fg ansi-green-bg\"> " + attr + ";" + bg + ";" + fg + " </span>";

        var l = ansi_up.ansi_to_html(start, {use_classes: true});
        l.should.eql(expected);
      });

      it('should transform a complex multi-line sequence to html', function() {
        var attr = 1;
        var fg = 32;
        var bg = 42;
        var start = "\n \033[" + fg + "m " + fg + "  \033[0m \n  \033[" + bg + "m " + bg + "  \033[0m \n zimpper ";

        var expected = "\n <span class=\"ansi-green-fg\"> " + fg + "  </span> \n  <span class=\"ansi-green-bg\"> " + bg + "  </span> \n zimpper ";

        var l = ansi_up.ansi_to_html(start, {use_classes: true});
        l.should.eql(expected);
      });
    });
    describe('ignore unsupported CSI', function() {
      it('should correctly convert a string similar to CSI', function() {
        // https://github.com/drudru/ansi_up/pull/15
        // "[1;31m" is a plain text. not an escape sequence.
        var start = "foo\033[1@bar[1;31mbaz\033[0m";
        var l = ansi_up.ansi_to_html(start);

        // is all plain texts exist?
        l.should.containEql('foo');
        l.should.containEql('bar');
        l.should.containEql('baz');
        l.should.containEql('1;31m');
      });
      it('(italic)', function() {
        var start = "foo\033[3mbar\033[0mbaz";
        var l = ansi_up.ansi_to_html(start);
        l.should.eql('foobarbaz');
      });
      it('(cursor-up)', function() {
        var start = "foo\033[1Abar";
        var l = ansi_up.ansi_to_html(start);
        l.should.eql('foobar');
      });
      it('(scroll-left)', function() {
        // <ESC>[1 @ (including ascii space)
        var start = "foo\033[1 @bar";
        var l = ansi_up.ansi_to_html(start);
        l.should.eql('foobar');
      });
      it('(DECMC)', function() {
        var start = "foo\033[?11ibar";
        var l = ansi_up.ansi_to_html(start);
        l.should.eql('foobar');
      });
      it('(RLIMGCP)', function() {
        var start = "foo\033[<!3ibar";
        var l = ansi_up.ansi_to_html(start);
        l.should.eql('foobar');
      });
      it('(DECSCL)', function() {
        var start = "foo\033[61;0\"pbar"
        var l = ansi_up.ansi_to_html(start);
        l.should.eql('foobar');
      });
    });
  });
});

